import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from '../../services/cashier.service';
import { SlideService } from '../../services/slide.service';
import { ClientService } from '../../services/client.service';
import { ModalTransactionComponent } from '../modal-transaction/modal-transaction.component';
import { MapService } from 'src/app/map.service';

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  
  client: IClient ={
    id: 1,
    name: "mock",
    account: "bancaMarch",
    dni: "",
    password: ""
  };

  cashiers: ICashier[] = [];
  mockCashiers:L.Marker = [
    {lat:37.687149, lng:-4.733906},
    {lat:37.690776, lng:-4.736738},
    {lat:37.69032, lng:-4.736127},
    {lat:37.912357, lng:-4.800441},
    {lat:37.912835, lng:-4.800317},
    {lat:37.912585, lng:-4.799883},
    {lat:37.911933, lng:-4.800172},
    {lat:37.9114, lng:-4.800328},
    {lat:37.66643, lng:-4.724818},
    {lat:37.666714, lng:-4.723296},
    {lat:37.667389, lng:-4.724084}
  ];

  //Marcas para el mapa
  map!: L.Map;
  myPos:L.Marker;
  actualRadius: L.Circle;
  markers:L.Marker = [];
  markerObjects = [];
  popup = L.popup();
  cpMarker: L.Marker;

  polygon: L.Polygon;

  //carga y localizacion
  @Output() ready: EventEmitter<any> = new EventEmitter();
  _ready:boolean=false;

  //detalles del cajero
  @Output() detailsEmitter: EventEmitter<any> = new EventEmitter();

  //radio de deteccion de cajeros
  radius:number = 100;

  //icons
  userIcon = L.icon({
    iconUrl: './assets/icons/user.png',
    iconSize:     [45, 45], // size of the icon
  });
  cashierIcon = L.icon({
    iconUrl: './assets/icons/atm-machine.png',
    iconSize:     [35, 35], // size of the icon
  })

  //modal
  isModalOpen:boolean = false;
  cash:number;

  @ViewChild(ModalTransactionComponent) modal:ModalTransactionComponent;
  //regex
  @Input('regexInput')regexInput:string;

  constructor(
    private slideService:SlideService, 
    private cashierService:CashierService,
    private clientS:ClientService,
    private mapService:MapService){

    /*
    this.cashierService.getCashiers().subscribe(e =>{
      this.cashiers.push(...e);
    });
    */
    /*
    this.cashierService.getAll().subscribe(e =>{
      this.cashiers.push(...e);
    })
    */

    this.slideService.circleRadius.subscribe(e =>{
      this.radius=e.radius;
      this.updateRadius(this.radius);
      if(e.request){
        this.setCashiers(this.radius);
      }
    });
  }

  ngOnInit(): void {
    this.clientS.user=this.client;
    console.log(this.cashiers)
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
      
      this.client = {
        id:1,
        name:"mock",
        account:"mock",
        dni:"",
        password:"",
        lat:e.latlng.lat,
        lng:e.latlng.lng,
        distance:this.radius
      }
      this.setCashiers(this.radius);
      this.setClient();
      
    }).once('locationerror',(e)=>{
      this.onLocationError(e);
    });

    this.map.on('click',(e)=>{
      //this.onMapClick(e);
        //this.markOnClose();
        this.addPos(e);
        this.ready.emit({
          event:"relocated",
          pos:e.latlng
        });
    });

    this.mapService.getLocationObservable().subscribe(location => {
      this.setLocationByCP(location.lat, location.lng);
    });
  }

  loadMap(){
    this.map = L.map('map', {
      zoomControl: false
    }).fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
     .bindPopup('<p>${"clientLocation" | translate}</p>');
     this.map.setView(e.latlng,18);
  }

  setCurrentLocation(){
    this.removePos();
    navigator.geolocation.getCurrentPosition(e =>{
      this.map.setView([e.coords.latitude,e.coords.longitude]);
      this.actualRadius = L.circle([e.coords.latitude,e.coords.longitude],{
        color: '#005442',
        fillOpacity: 0.2,
        radius: this.radius,
      }).addTo(this.map);
      this.myPos= L.marker([e.coords.latitude,e.coords.longitude],{
        icon: this.userIcon
      }).addTo(this.map)
       .bindPopup('<p>${"clientLocation" | translate}</p>');
    });

    //Cannot read properties of null (reading 'layerPointToLatLng')
    /*
    this.updateRadius(this.radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    */
  }

  setLocationByCP(lat: number, lng: number){
    const newLatLng = new L.LatLng(lat, lng);
    this.map.setView(newLatLng, 13);
    if (this.cpMarker) {
      this.cpMarker.setLatLng(newLatLng);
    } else {
      this.cpMarker = L.marker(newLatLng).addTo(this.map);
      this.mapService.getPolygonObservable().subscribe(
        (polygonGeoJSON: any) => {
          // draw polygon
          this.drawPolygon(polygonGeoJSON);
        }
      );
      //let area = L.GeometryUtil.geodesicArea(this.polygon.getLatLngs);
      this.setCashiers(2000);
    }
  }

  setCashiers(distance:number){
    try{   
      this.markers=[];
      this.cashierService.getCashiersByRadius(this.client.id,this.client.lat,this.client.lng,distance).subscribe(cashier=>{
        cashier.forEach(mark =>{
          //console.log(mark)
          if((mark.lattitude && mark.longitude) != undefined){
            this.markers.push({id: mark.id, lat: mark.lattitude, lng:mark.longitude})
            this.cashierService.addItem(this.markers);
          }
        })
        this.addMarkers(this.markers);
      })
    }catch(error){
      console.error(error);
    }
   
  }

  setClient(){
    this.clientS.user.id=this.client.id;
    this.clientS.user.lat=this.client.lat;
    this.clientS.user.lng=this.client.lng;
    this.clientS.user.distance=this.radius;
  }

  addMarkers(markers: Array<{id:number,lat:number,lng:number}>){
    let m;
    markers.forEach(marker => {
      if(this.isMarkeInsideRadius(marker,this.actualRadius)){
        m = L.marker([marker.lat, marker.lng],{
          icon: this.cashierIcon
        }).addTo(this.map).on('click', () => this.markOnClick(marker.id));
        this.markerObjects.push(m);
      }
    });
  }

  removeAllMarkers(){
    this.markerObjects.forEach(marker =>{
      this.map.removeLayer(marker);
    });
    this.markerObjects = [];
  }

  drawPolygon(polygonGeoJSON: any) {
    if (!this.polygon) {
      this.polygon = new L.Polygon(polygonGeoJSON,{
        fillColor: 'green',
        color: '#005442',
        weight: 2,
        opacity: 0.2
      }).addTo(this.map);
    }else{
      this.map.removeLayer(this.polygon);
      this.polygon = new L.Polygon(polygonGeoJSON,{
        fillColor: 'green',
        color: '#005442',
        weight: 2,
        opacity: 0.2
      }).addTo(this.map);
    }
  }
  

  addPos(e){
    this.removePos();
    this.myPos= L.marker(e.latlng,{
      icon: this.userIcon,
      draggable: true,
      autoPan: true,
    }).addTo(this.map);

    this.actualRadius = L.circle([e.latlng.lat,e.latlng.lng],{
      color: '#005442',
      fillOpacity: 0.2,
      radius: this.radius,
    }).addTo(this.map);

    this.client.lat=e.latlng.lat;
    this.client.lng=e.latlng.lng;
    this.map.setView(e.latlng);
    this.updateRadius(this.radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    this.setCashiers(this.radius);
    this.setClient();
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
    this.removeAllMarkers();
    this.actualRadius.setRadius(radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    this.setClient();
  }

  isMarkeInsideRadius(marker: {lat: number, lng: number}, circle: L.Circle) {
    let insideMark = L.latLng(marker.lat, marker.lng);
    return circle.getBounds().contains(insideMark);
  }

  markOnClick(id:number){
    this.modal.open(id);
    //this.isModalOpen=true;
  }

  markOnClose(){
    document.getElementById('myModal').style.display = 'none';
    //this.isModalOpen=false;
  }
}