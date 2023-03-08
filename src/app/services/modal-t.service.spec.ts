import { TestBed } from '@angular/core/testing';

import { ModalTService } from './modal-t.service';

describe('ModalTService', () => {
  let service: ModalTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
