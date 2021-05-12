import { TestBed } from '@angular/core/testing';

import { DeliveryLocationsService } from './delivery-locations.service';

describe('DeliveryLocationsService', () => {
  let service: DeliveryLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
