import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SlideService } from 'src/app/services/slide.service';

@Component({
  selector: 'app-radio-slider',
  templateUrl: './radio-slider.component.html',
  styleUrls: ['./radio-slider.component.scss']
})
export class RadioSliderComponent {

  color: ThemePalette
  disabled: boolean
  radius: number;

  @Output() updateRadius = new EventEmitter<number>();

  constructor(private slideService:SlideService){}

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'km';
    }
    this.radius=value;
    return `${value}`;
  }
  onRadiusChange() {
    this.slideService.updateRadius(this.radius);
  }
}
