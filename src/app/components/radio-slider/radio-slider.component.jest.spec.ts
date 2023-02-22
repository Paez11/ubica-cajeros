import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RadioSliderComponent } from './radio-slider.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemePalette } from '@angular/material/core';

describe('RadioSliderComponent', () => {
  let component: RadioSliderComponent;
  let fixture: ComponentFixture<RadioSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ RadioSliderComponent ],
      providers: [TranslateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onRadiusChange', () =>{
    let value:any;
    component.onRadiusChange(value);
    expect(component.radius).toEqual(value.value);
  });

  it('should onRadiusChangeTerminated', () =>{
    expect(component.onRadiusChangeTerminated()).toBeDefined();
  })
});
