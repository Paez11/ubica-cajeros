import { Observable, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MapComponent } from '../components/map/map.component';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private map$ = new Observable<MapComponent>();

  constructor() { }
  
  setMap(map: MapComponent) {
    this.map$ = of(map);
  }

  getMap(): Observable<MapComponent> {
    return this.map$
  }
}
