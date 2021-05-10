import { TestBed } from '@angular/core/testing';

import { DeliveryAddressStoreService } from './delivery-address-store.service';

describe('DeliveryAddressStoreService', () => {
  let service: DeliveryAddressStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryAddressStoreService],
    });
    service = TestBed.inject(DeliveryAddressStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
