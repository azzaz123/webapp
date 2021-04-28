import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_COUNTRY } from '@fixtures/private/delivery/delivery-country.fixtures.spec';
import { DeliveryCountryApi } from '@private/features/delivery/interfaces/delivery-country/delivery-country-api.interface';

import { DeliveryCountryApiService, DELIVERY_COUNTRY_API_URL } from './delivery-country-api.service';

describe('DeliveryCountryApiService', () => {
  const postalCode = '08027';
  let service: DeliveryCountryApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryCountryApiService],
    });
    service = TestBed.inject(DeliveryCountryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting delivery address...', () => {
    it('should send a petition to get the delivery address', () => {
      const expectedURL = DELIVERY_COUNTRY_API_URL(postalCode);
      let response: DeliveryCountryApi;

      service.get(postalCode).subscribe((data: DeliveryCountryApi) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(expectedURL);
      req.flush(MOCK_DELIVERY_COUNTRY);

      expect(response).toEqual(MOCK_DELIVERY_COUNTRY);
      expect(req.request.url).toEqual(expectedURL);
      expect(req.request.method).toBe('GET');
    });
  });
});
