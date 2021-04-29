import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeliveryCountriesApiService } from './delivery-countries-api.service';

describe('DeliveryCountriesApiService', () => {
  let service: DeliveryCountriesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryCountriesApiService],
    });
    service = TestBed.inject(DeliveryCountriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
