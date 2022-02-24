import { TestBed } from '@angular/core/testing';

import { DeliveryMapService } from './delivery-map.service';

describe('DeliveryMapService', () => {
  let service: DeliveryMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
