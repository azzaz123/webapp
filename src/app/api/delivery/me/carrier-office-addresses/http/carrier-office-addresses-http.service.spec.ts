import { TestBed } from '@angular/core/testing';

import { CarrierOfficeAddressesHttpService } from './carrier-office-addresses-http.service';

describe('CarrierOfficeAddressesHttpService', () => {
  let service: CarrierOfficeAddressesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrierOfficeAddressesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
