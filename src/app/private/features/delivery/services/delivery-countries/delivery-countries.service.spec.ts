import { TestBed } from '@angular/core/testing';

import { DeliveryCountriesService } from './delivery-countries.service';

describe('DeliveryCountriesService', () => {
  let service: DeliveryCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
