import { TestBed } from '@angular/core/testing';

import { DeliveryCountriesApiService } from './delivery-countries-api.service';

describe('DeliveryCountriesApiService', () => {
  let service: DeliveryCountriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryCountriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
