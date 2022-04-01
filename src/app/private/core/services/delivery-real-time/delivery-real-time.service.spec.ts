import { TestBed } from '@angular/core/testing';

import { DeliveryRealTimeService } from './delivery-real-time.service';

describe('DeliveryRealTimeService', () => {
  let service: DeliveryRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
