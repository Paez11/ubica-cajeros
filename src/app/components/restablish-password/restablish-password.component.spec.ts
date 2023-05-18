import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablishPasswordComponent } from './restablish-password.component';

describe('RestablishPasswordComponent', () => {
  let component: RestablishPasswordComponent;
  let fixture: ComponentFixture<RestablishPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestablishPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestablishPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
