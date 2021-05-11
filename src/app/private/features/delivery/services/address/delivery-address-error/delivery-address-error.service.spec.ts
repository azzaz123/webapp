import { TestBed } from '@angular/core/testing';

import { DeliveryAddressErrorService } from './delivery-address-error.service';

describe('DeliveryAddressErrorService', () => {
  let service: DeliveryAddressErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryAddressErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
