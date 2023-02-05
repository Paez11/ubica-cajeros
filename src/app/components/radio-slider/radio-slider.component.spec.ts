import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSliderComponent } from './radio-slider.component';

describe('RadioSliderComponent', () => {
  let component: RadioSliderComponent;
  let fixture: ComponentFixture<RadioSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
