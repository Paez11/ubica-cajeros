import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import MapComponent from './map.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [MapComponent],
      providers: [TranslateService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should removeAllMarkers', () => {
    component.removeAllMarkers();
    expect(component.markerObjects).toEqual([]);
  });

  it('should addMarkers', ()=>{
    component.addMarkers(component.markers);
    expect(component.markers).toBeDefined();
  });

  it('should loadMap', () =>{
    component.loadMap();
    expect(component.map).toBeDefined();
  });

  it('should updateRadius', () =>{
    expect(component.updateRadius(component.radius)).toBeDefined;
  })


});
