import { TestBed } from '@angular/core/testing';

import { PaymentsCreditCardService } from './payments-credit-card.service';

describe('PaymentsCreditCardService', () => {
  let service: PaymentsCreditCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsCreditCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
