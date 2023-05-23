import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { MapComponent } from '../components/map/map.component';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private lat: number;
  private lng: number;
  private locationSubject: BehaviorSubject<{ lat: number, lng: number }>;
  private polygonSubject = new Subject<any>();
  private street:string;
  private streetSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient,
              private mapComponent: MapComponent) {
    this.locationSubject = new BehaviorSubject<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
    this.streetSubject = new BehaviorSubject<string>(this.street);
  }

  public searchByPostalCode(postalCode: string){
    if(postalCode===null){
      throw new Error("Error en datos codigo postal");
    }
    const endpoint =environment.nominatimAPI.url;
    this.http.
    get(endpoint+`search?q=${postalCode}&format=jsonv2&countrycodes=es&polygon_geojson=1`)
    .subscribe((data: any) => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lng = data[0].lon;
          
          this.setLocation(lat, lng);
          const polygonGeoJSON = data[0]?.geojson;
          
          if(polygonGeoJSON){
            this.setPolygon(polygonGeoJSON);
          }

        
        }
      });
  }

  public setLocation(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.locationSubject.next({ lat: this.lat, lng: this.lng });
  }

  public getLocationObservable(): Observable<{ lat: number, lng: number }> {
    return this.locationSubject.asObservable();
  }

  public setPolygon(polygonData: any) {
    this.polygonSubject.next(polygonData);
  }

  public getPolygonObservable() {
    return this.polygonSubject.asObservable();
  }

  public setStreet(street: string) {
    this.streetSubject.next(street);
  }

  public getstreetObservable(): Observable<string> {
    return this.streetSubject.asObservable();
  }
}
