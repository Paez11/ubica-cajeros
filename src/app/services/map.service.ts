import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private lat: number;
  private lng: number;
  private locationSubject: BehaviorSubject<{ lat: number, lng: number }>;
  private polygonSubject = new Subject<any>();

  constructor() {
    this.locationSubject = new BehaviorSubject<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
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
}
