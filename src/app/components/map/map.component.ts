import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from '../../services/cashier.service';
import { SlideService } from '../../services/slide.service';
import { ClientService } from '../../services/client.service';
import { MapService } from 'src/app/services/map.service';
import { Subscription } from 'rxjs';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IATMParams } from 'src/app/model/IATMParams';

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  client: IClient = {
    id: 1,
    account: '',
    dni: '',
    password: '',
    lat: 0,
    lng: 0,
  };

  cashiers: ICashier[] = [];
  selectedCashier: ICashier;

  //Marcas para el mapa
  map!: L.Map;
  myPos: L.Marker;
  actualRadius: L.Circle;
  markers: L.Marker = [];
  markerObjects = [];
  popup = L.popup();
  searchMarker: L.Marker;

  polygon: L.Polygon;

  //carga y localizacion
  @Output() ready: EventEmitter<any> = new EventEmitter();
  _ready: boolean = false;

  //radio de deteccion de cajeros
  radius: number = 100;

  //icons
  userIcon = L.icon({
    iconUrl: './assets/icons/user.png',
    iconSize: [45, 45], // size of the icon
  });
  cashierIcon = L.icon({
    iconUrl: './assets/icons/atm-machine.png',
    iconSize: [35, 35], // size of the icon
  });

  //modal
  isModalOpen: boolean = false;
  //Subscriptions
  private polygonSubscription: Subscription;
  private slideSubscription: Subscription;
  private searchSubscription: Subscription;
  private cashierSubscription: Subscription;
  private streetSubscription: Subscription;

  street: string;

  constructor(
    private _slideService: SlideService,
    private _cashierService: CashierService,
    private _clientS: ClientService,
    private _mapService: MapService,
    private searchBar: SearchbarComponent,
    private _translateService: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    
    this._clientS.getUserObservable().subscribe((client) => {
      if (client) {
        this.client = client;
      }
    });
  }

  ngAfterViewInit(): void {
    this.slideSubscription = this._slideService.circleRadius.subscribe((e) => {
      this.radius = e.radius;
      this.updateRadius(this.radius);
      if (e.request) {
        this.setCashiers(this.radius);
      }
    });
  }

  ngOnInit(): void {
    if (this.map != undefined) {
      this.map.off();
      this.map.remove();
    }
    this.loadMap();
    this.map
      .locate({ setView: false, enableHighAccuracy: true })
      .once('locationfound', async (e: L.LocationEvent) => {
        this.currentLocation(e);
        this._ready = true;
        this.ready.emit({
          event: 'located',
          pos: e.latlng,
        });
        (this.client.lat = e?.latlng?.lat),
          (this.client.lng = e?.latlng?.lng),
          this.setCashiers(this.radius);
        this.setClient();
      })
      .once('locationerror', (e) => {
        this._ready = true;
        this.onLocationError(e);
        /* this.toastr.error(
          this.translate.instant('locationErrorInfo'),
          this.translate.instant('locationError')
        );
        this.router.navigate(['/login']) */
      });

    this.map.on('click', (e) => {
      //this.onMapClick(e);
      //this.markOnClose();
      this.addPos(e);
      this.ready.emit({
        event: 'relocated',
        pos: e.latlng,
      });
    });

    this.streetSubscription = this._mapService
      .getstreetObservable()
      .subscribe((street) => {
        this.street = street;
      });
    this.searchSubscription = this._mapService
      .getLocationObservable()
      .subscribe((location) => {
        if (this.searchBar.street == null) {
          this.setLocationBySearch(location.lat, location.lng);
        }
      });
  }

  loadMap() {
    this.map = L.map('map', {
      zoomControl: false,
    }).fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.map);
  }

  currentLocation(e: L.LocationEvent | L.LeafletMouseEvent) {
    this.removePos();
    this.actualRadius = L.circle([e.latlng.lat, e.latlng.lng], {
      color: '#005442',
      fillOpacity: 0.2,
      radius: this.radius,
    }).addTo(this.map);
    this.myPos = L.marker(e.latlng, {
      icon: this.userIcon,
    })
      .addTo(this.map)
      .bindPopup(
        '<p>' + this._translateService.instant('clientLocation', '') + '</p>'
      );
    this.map.setView(e.latlng, 18);
  }

  setCurrentLocation() {
    this.removePos();
    this.removeSearchMark();
    navigator.geolocation.getCurrentPosition((e) => {
      this.map.setView([e.coords.latitude, e.coords.longitude]);
      this.actualRadius = L.circle([e.coords.latitude, e.coords.longitude], {
        color: '#005442',
        fillOpacity: 0.2,
        radius: this.radius,
      }).addTo(this.map);
      this.myPos = L.marker([e.coords.latitude, e.coords.longitude], {
        icon: this.userIcon,
      })
        .addTo(this.map)
        .bindPopup('<p>{{"clientLocation" | translate}}</p>');
    });

    //Cannot read properties of null (reading 'layerPointToLatLng')
    /*
    this.updateRadius(this.radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    */
  }

  setLocationBySearch(lat: number, lng: number) {
    this.removeSearchMark();
    const newLatLng = new L.LatLng(lat, lng);
    this.map.setView(newLatLng, 13);
    if (this.searchMarker) {
      this.searchMarker.setLatLng(newLatLng);
      this.searchMarker = L.marker(newLatLng).addTo(this.map);
      this.setCashiersBySearch(this.street);
      /*
      this.polygonSubscription = this.mapService.getPolygonObservable().subscribe(
        (polygonGeoJSON: any) => {
          console.log("SEGUNDA ENTRADA -->", polygonGeoJSON);
          // draw polygon
          this.drawPolygon(polygonGeoJSON);
        }
      );
      */
      //let area = L.GeometryUtil.geodesicArea(this.polygon.getLatLngs);
    } else {
      this.searchMarker = L.marker(newLatLng).addTo(this.map);
    }
  }

  setCashiers(distance: number) {
    try {
      this.markers = [];
      this.cashierSubscription = this._cashierService
        .getCashiersByRadius(
          this.client,
          this.client.lat,
          this.client.lng,
          distance
        )
        .subscribe((cashier) => {
          this.cashiers = [];
          this.cashiers.push(...cashier);
          this._mapService.updateCashierList(this.cashiers);
          cashier.forEach((mark) => {
            if ((mark.lattitude && mark.longitude) != undefined) {
              this.markers.push({
                id: mark.id,
                lat: mark.lattitude,
                lng: mark.longitude,
                available: mark.available,
              });
              this._cashierService.addItem(this.markers);
            }
          });
          this.addMarkers(this.markers);
        });
    } catch (error) {
      console.error(error);
    }
  }

  setCashiersBySearch(street: string) {
    const regex = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
    try {
      this.markers = [];
      if (regex.test(street)) {
        this.cashierSubscription = this._cashierService
          .getCashiersByCP(street)
          .subscribe((cashier) => {
            cashier.forEach((mark) => {
              if ((mark.lattitude && mark.longitude) != undefined) {
                this.markers.push({
                  id: mark.id,
                  lat: mark.lattitude,
                  lng: mark.longitude,
                });
                this._cashierService.addItem(this.markers);
              }
            });
          });
      } else {
        this.cashierSubscription = this._cashierService
          .getCashiersByAddress(street)
          .subscribe((cashier) => {
            cashier.forEach((mark) => {
              if ((mark.lattitude && mark.longitude) != undefined) {
                this.markers.push({
                  id: mark.id,
                  lat: mark.lattitude,
                  lng: mark.longitude,
                });
                this._cashierService.addItem(this.markers);
              }
            });
          });
      }
      this.addMarkers2(this.markers);
    } catch (error) {
      console.error(error);
    }
  }

  setClient() {
    this._clientS.user.id = this.client.id;
    this._clientS.user.lat = this.client.lat;
    this._clientS.user.lng = this.client.lng;
    this._clientS.user.distance = this.radius;
  }

  addMarkers(markers: Array<{ id: number; lat: number; lng: number; available: boolean }>) {
    let m: any;
    markers.forEach((marker) => {
      if (
        this.isMarkeInsideRadius(marker, this.actualRadius) &&
        marker.available
      ) {
        m = L.marker([marker.lat, marker.lng], {
          icon: this.cashierIcon,
        })
          .addTo(this.map)
          .on('click', () => this.markOnClick(marker.id));
        this.markerObjects.push(m);
      }
    });
  }

  addMarkers2(markers: Array<{ id: number; lat: number; lng: number }>) {
    let m: any;
    markers.forEach((marker) => {
      m = L.marker([marker.lat, marker.lng], {
        icon: this.cashierIcon,
      })
        .addTo(this.map)
        .on('click', () => this.markOnClick(marker.id));
      //this.markerObjects.push(m);
    });
  }

  removeAllMarkers() {
    this.markerObjects.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markerObjects = [];
  }

  drawPolygon(polygonGeoJSON: any) {
    if (!this.polygon) {
      this.polygon = new L.Polygon(polygonGeoJSON, {
        fillColor: 'green',
        color: '#005442',
        weight: 2,
        opacity: 0.2,
      }).addTo(this.map);
    } else {
      this.map.removeLayer(this.polygon);
      this.polygon = new L.Polygon(polygonGeoJSON, {
        fillColor: 'green',
        color: '#005442',
        weight: 2,
        opacity: 0.2,
      }).addTo(this.map);
    }
  }

  addPos(e) {
    this.removePos();
    this.removeSearchMark();
    this.myPos = L.marker(e.latlng, {
      icon: this.userIcon,
      draggable: true,
      autoPan: true,
    }).addTo(this.map);

    this.actualRadius = L.circle([e.latlng.lat, e.latlng.lng], {
      color: '#005442',
      fillOpacity: 0.2,
      radius: this.radius,
    }).addTo(this.map);

    this.client.lat = e.latlng.lat;
    this.client.lng = e.latlng.lng;
    this.map.setView(e.latlng);
    this.updateRadius(this.radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    this.setCashiers(this.radius);
    this.setClient();
  }

  removePos() {
    if (this.myPos) {
      this.myPos.removeFrom(this.map);
      this.actualRadius.remove();
    }
  }

  removeSearchMark() {
    if (this.searchMarker) {
      this.searchMarker.removeFrom(this.map);
      //this.polygon.removeFrom(this.map);
    }
  }

  onMapClick(e) {
    this.popup
      .setLatLng(e.latlng)
      .setContent('You clicked the map at ' + e.latlng.toString())
      .openOn(this.map);
  }

  onLocationError(e: any) {
    alert(e.message);
  }

  updateRadius(radius: number) {
    this.removeAllMarkers();
    this.removeSearchMark();
    this.actualRadius.setRadius(radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    this.setClient();
  }

  isMarkeInsideRadius(marker: { lat: number; lng: number }, circle: L.Circle) {
    let insideMark = L.latLng(marker.lat, marker.lng);
    return circle.getBounds().contains(insideMark);
  }

  markOnClick(id: number) {
    let params: IATMParams;
    this.cashiers.find( (val) => {
      if(val.id === id) {
        params = {
          id: val.id,
          img: val.photo
        }
      }
    });
    this.router.navigate(['/main/transaction', params]);
  }

  markOnClose() {
  }

  ngOnDestroy() {
    if (this.polygonSubscription) {
      this.polygonSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.streetSubscription) {
      this.streetSubscription.unsubscribe();
    }
    if (this.cashierSubscription) {
      this.cashierSubscription.unsubscribe();
    }
    if (this.slideSubscription) {
      this.slideSubscription.unsubscribe();
    }
  }
}
