import { TestBed } from '@angular/core/testing';

import { ContinueWithCreditCardService } from './continue-with-credit-card.service';

describe('ContinueWithCreditCardService', () => {
  let service: ContinueWithCreditCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContinueWithCreditCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
