import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private lat: number;
  private lng: number;
  private locationSubject: BehaviorSubject<{ lat: number, lng: number }>;
  private polygonSubject = new Subject<any>();

  constructor(private http: HttpClient, private searchBar:SearchbarComponent) {
    this.locationSubject = new BehaviorSubject<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
  }

  public searchByPostalCode(postalCode: string){
    this.http.
    get(`https://nominatim.openstreetmap.org/search?q=${this.searchBar.street}&format=jsonv2&countrycode=es&polygon_geojson=1`)
    .subscribe((data: any) => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lng = data[0].lon;
          console.log("polygon data -->", data)
          console.log(lat,lng)
          this.setLocation(lat, lng);
          const polygonGeoJSON = data[0]?.geojson;
          console.log("este es el poligono -->", polygonGeoJSON)
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
    console.log("HAY POLIGONO-->", polygonData)
    this.polygonSubject.next(polygonData);
  }

  public getPolygonObservable() {
    console.log("HAY POLIGONO")
    return this.polygonSubject.asObservable();
  }
}
