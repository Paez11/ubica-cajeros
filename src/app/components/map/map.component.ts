import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable,Subscriber } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { environment } from 'src/environments/environment';

L.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  client!: IClient;
  cashiers: ICashier[] = [];
  map!: L.Map;
  cordoba = new L.Marker([37.884531, -4.777390]).bindPopup('cordoba');
  cashiersMarkers = new L.LayerGroup([this.cordoba]);
  myPos:L.Marker;

  popup = L.popup();

  constructor(){
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
    })
    .once('locationerror',(e)=>{
      this.onLocationError(e);
    });

  this.map.on('click',(e)=>{
    this.onMapClick(e);
    //this.addPos(e);
  });    

      
   
  }

  loadMap(){
    this.map = L.map('map').fitWorld();
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
  }

  currentLocation(e:L.LocationEvent|L.LeafletMouseEvent){
    this.removePos();
    let circle = L.circle([e.latlng.lat,e.latlng.lng],{
      color: 'blue',
      fillOpacity: 0.2,
      radius: 500
    }).addTo(this.map);
    this.myPos= L.marker(e.latlng).addTo(this.map)
     .bindPopup('Your current location')
     .openPopup();
     this.map.setView(e.latlng,16);
  }

  currentCashierLocation(circle:L.Circle){

  }


  addPos(e:L.LocationEvent|L.LeafletMouseEvent){
    this.removePos();
    this.myPos= L.marker(e.latlng).addTo(this.map)
     .bindPopup("")
     this.map.setView(e.latlng,16);
  }

  removePos(){
    if(this.myPos){
      this.myPos.removeFrom(this.map);
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


  
}
