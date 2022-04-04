import { TestBed } from '@angular/core/testing';

import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';

describe('DeliveryPaymentReadyService', () => {
  let service: DeliveryPaymentReadyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryPaymentReadyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
