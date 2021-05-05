import { TestBed } from '@angular/core/testing';

import { DeliveryLocationService } from './delivery-location.service';

describe('DeliveryLocationService', () => {
  let service: DeliveryLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
