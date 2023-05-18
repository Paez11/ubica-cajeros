import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-radio-slider',
  templateUrl: './radio-slider.component.html',
  styleUrls: ['./radio-slider.component.scss'],
})
export class RadioSliderComponent {
  color: ThemePalette;
  disabled: boolean;
  public radius: number = 100;

  @Output() updateRadius = new EventEmitter<number>();

  constructor(private _slideService: SlideService) {}

  onRadiusChange(event: any) {
    this.radius = event.value;
    this._slideService.updateRadius(this.radius);
  }
  onRadiusChangeTerminated() {
    this._slideService.updateRadiusTerminated(this.radius);
  }
}
