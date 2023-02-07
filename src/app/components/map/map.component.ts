import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable,Subscriber } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { MapService } from 'src/app/services/map.service';
import { SlideService } from 'src/app/services/slide.service';

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  
  client!: IClient;
  cashiers: ICashier[] = [];
  mockCashiers:L.Marker = [
    {lat:37.687149, lng:-4.733906},
    {lat:37.690776, lng:-4.736738},
    {lat:37.69032, lng:-4.736127},
    {lat:37.912357, lng:-4.800441},
    {lat:37.912835, lng:-4.800317},
    {lat:37.912585, lng:-4.799883},
    {lat:37.911933, lng:-4.800172}
  ];

  //Marcas para el mapa
  map!: L.Map;
  myPos:L.Marker;
  actualRadius: L.Circle;
  markers:L.Marker[];
  popup = L.popup();

  //carga y localizacion
  @Output() ready: EventEmitter<any> = new EventEmitter();
  _ready:boolean=false;

  //detalles del cajero
  @Output() detailsEmitter: EventEmitter<any> = new EventEmitter();

  //radio de deteccion de cajeros
  radius:number = 50;

  //icons
  userIcon = L.icon({
    iconUrl: './assets/icons/user.png',
    iconSize:     [45, 45], // size of the icon
  });
  cashierIcon = L.icon({
    iconUrl: './assets/icons/atm-machine.png',
    iconSize:     [45, 45], // size of the icon
  })

  constructor(private slideService:SlideService, private cashierService:MapService){
    /*
    this.cashierService.getAll().subscribe(e =>{ 
      this.cashiers=e
    });
    */
    this.slideService.circleRadius$.subscribe(e =>{
      this.radius=e;
    });
  }


  ngOnInit(): void {
    if(this.map != undefined){
      this.map.off();
      this.map.remove();
    }
    this.loadMap();

    this.map.locate({setView: false, enableHighAccuracy:true})
    .once("locationfound" , async (e:L.LocationEvent)=>{
      this.currentLocation(e);
      this._ready=true;
      this.ready.emit({
        event:"located",
        pos:e.latlng
      });
      this.addMarkers2(this.mockCashiers);

    }).once('locationerror',(e)=>{
      this.onLocationError(e);
    });

    this.map.on('click',(e)=>{
      this.onMapClick(e);
      /*
      this.addPos(e);
      this.ready.emit({
        event:"relocated",
        pos:e.latlng
      });
      */
    });
    
    /*
    this.map.on('update',()=>{
      this.slideService.sliderTrigger.subscribe(e =>{
        this.radius=e;
      })
    })
    */
    
  }

  loadMap(){
    this.map = L.map('map', {
      zoomControl: false
    }).fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    L.Routing.control({
        router: L.Routing.osrmv1({
          serviceUrl: `http://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      //lineOptions: {styles: [{color: 'blue', weight: 7}]},
      fitSelectedRoutes: false,
      show: false,
      routeWhileDragging: true,
      /*
      waypoints: [
        this.currentLocation(),
        this.onMapClick()
      ]
      */
    }).addTo(this.map);

    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);
  }

  currentLocation(e:L.LocationEvent|L.LeafletMouseEvent){
    this.removePos();
    this.actualRadius = L.circle([e.latlng.lat,e.latlng.lng],{
      color: '#005442',
      fillOpacity: 0.2,
      radius: this.radius,
    }).addTo(this.map);
    this.myPos= L.marker(e.latlng,{
      icon: this.userIcon
    }).addTo(this.map)
     .bindPopup('Your current location')
     .openPopup();
     this.map.setView(e.latlng,18);
  }

  setCurrentLocation(){
    this.removePos();
    navigator.geolocation.getCurrentPosition(e =>{
      this.map.setView([e.coords.latitude,e.coords.longitude],18);
      this.actualRadius = L.circle([e.coords.latitude,e.coords.longitude],{
        color: '#005442',
        fillOpacity: 0.2,
        radius: this.radius,
      }).addTo(this.map);
      this.myPos= L.marker([e.coords.latitude,e.coords.longitude],{
        icon: this.userIcon
      }).addTo(this.map)
       .bindPopup('Your current location')
       .openPopup();
    })
  }

  addMarkers(els:Array<any>){
    //this.removeAllMarkers();
    for(let el of els){
      let m=L.marker(el.latlng,{
        icon: this.cashierIcon
      }).addTo(this.map)
      .bindPopup("cashier");
      this.markers.push(m);
    }
  }

  addMarkers2(markers: Array<{lat:number,lng:number}>){
    markers.forEach(marker => {
      if(this.isMarkeInsideRadius(marker,this.actualRadius)){
        let m = L.marker([marker.lat, marker.lng],{
          icon: this.cashierIcon
        }).addTo(this.map).bindPopup("cashier");
      }
    });
  }

  removeAllMarkers(){
    for(let m of this.markers){
      if(m){
        m.removeFrom(this.map);
      }
    }
    this.markers=[];
  }

  addPos(e){
    this.removePos();
    this.myPos= L.marker(e.latlng,{
      icon: this.userIcon,
      draggable: true,
      autoPan: true,
    }).addTo(this.map)
    this.actualRadius = L.circle([e.latlng.lat,e.latlng.lng],{
      color: '#005442',
      fillOpacity: 0.2,
      radius: this.radius,
    }).addTo(this.map);
    this.map.setView(e.latlng,16);
  }

  removePos(){
    if(this.myPos){
      this.myPos.removeFrom(this.map);
      this.actualRadius.remove();
    }
  }

  onMapClick(e) {
    this.popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
  }

  onLocationError(e:any) {
    alert(e.message);
  }

  updateRadius(radius:number){
    console.log("actualizando")
    this.actualRadius.setRadius(radius);
  }

  isMarkeInsideRadius(marker: {lat: number, lng: number}, circle: L.Circle) {
    let insideMark = L.latLng(marker.lat, marker.lng);
    return circle.getBounds().contains(insideMark);
  }
  
}
