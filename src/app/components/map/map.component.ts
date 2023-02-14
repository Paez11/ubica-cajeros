import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { SlideService } from 'src/app/services/slide.service';
import { ClientService } from 'src/app/services/client.service';

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
    account: "bancaMarch"
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

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  //regex
  @Input('regexInput')regexInput:string;

  constructor(
    private slideService:SlideService, 
    private cashierService:CashierService,
    private clientS:ClientService){

    /*
    this.cashierService.getCashiers().subscribe(e =>{
      this.cashiers.push(...e);
    });
    */

    this.cashierService.getAll().subscribe(e =>{
      this.cashiers.push(...e);
    })
    
    this.slideService.circleRadius.subscribe(e =>{
      this.radius=e.radius;
      this.updateRadius(this.radius);
      if(e.request){
        this.setCashiers();
      }
    });
  }

  ngOnInit(): void {
    
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
        lat:e.latlng.lat,
        lng:e.latlng.lng
      }
      this.setCashiers();
      
    }).once('locationerror',(e)=>{
      this.onLocationError(e);
    });

    this.map.on('click',(e)=>{
      //this.onMapClick(e);
        this.markOnClose();
        this.addPos(e);
        this.ready.emit({
          event:"relocated",
          pos:e.latlng
        });
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

  setCashiers(){
    try{   
      this.cashierService.getCashiersByRadius(this.client.id,this.client.lat,this.client.lng,this.radius).subscribe(cashier=>{
        cashier.forEach(mark =>{
          if((mark.lattitude && mark.longitude) != undefined){
            this.markers.push({lat: mark.lattitude, lng:mark.longitude})
          }
        })
      })
    }catch(error){
      console.error(error);
    }
    console.log(this.markers)
    this.addMarkers(this.markers);
  }

  addMarkers(markers: Array<{lat:number,lng:number}>){
    let m;
    markers.forEach(marker => {
      if(this.isMarkeInsideRadius(marker,this.actualRadius)){
        m = L.marker([marker.lat, marker.lng],{
          icon: this.cashierIcon
        }).addTo(this.map).on('click', () => this.markOnClick());
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
    this.map.setView(e.latlng);
    this.updateRadius(this.radius);
    this.map.fitBounds(this.actualRadius.getBounds());
    this.setCashiers();
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
  }

  isMarkeInsideRadius(marker: {lat: number, lng: number}, circle: L.Circle) {
    let insideMark = L.latLng(marker.lat, marker.lng);
    return circle.getBounds().contains(insideMark);
  }

  markOnClick(){
    document.getElementById("launchModal")?.click();
    this.isModalOpen=true;
  }

  markOnClose(){
    document.getElementById('myModal').style.display = 'none';
    this.isModalOpen=false;
  }
  
  getQR(){
    //this.showQR = true;
    console.log("QR ABIERTO")
  }
}