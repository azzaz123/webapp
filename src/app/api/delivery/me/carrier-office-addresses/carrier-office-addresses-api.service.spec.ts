import { TestBed } from '@angular/core/testing';

import { CarrierOfficeAddressesApiService } from './carrier-office-addresses-api.service';

describe('CarrierOfficeAddressesApiService', () => {
  let service: CarrierOfficeAddressesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrierOfficeAddressesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
