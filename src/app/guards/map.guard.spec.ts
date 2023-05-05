import { TestBed } from '@angular/core/testing';

import { MapGuard } from './map.guard';

describe('MapGuard', () => {
  let guard: MapGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MapGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
