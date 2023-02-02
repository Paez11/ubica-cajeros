import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  @Output() sliderTrigger: EventEmitter<number> = new EventEmitter();
  
  private circleRadiusSource = new Subject<number>();
  circleRadius$ = this.circleRadiusSource.asObservable();
  constructor() { }

  updateRadius(radius: number){
    this.circleRadiusSource.next(radius);
  }
}
