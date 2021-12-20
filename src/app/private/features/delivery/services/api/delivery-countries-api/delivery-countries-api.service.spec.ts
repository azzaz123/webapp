import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_VERSION } from '@environments/version';
import { MOCK_DELIVERY_COUNTRIES_API } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';

import { DeliveryCountriesApiService, DELIVERY_COUNTRIES_API_URL } from './delivery-countries-api.service';

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

  describe('when getting active delivery countries...', () => {
    it('should send a petition to get the delivery countries', () => {
      let response: DeliveryCountriesApi;

      service.get().subscribe((data: DeliveryCountriesApi) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(DELIVERY_COUNTRIES_API_URL);
      req.flush(MOCK_DELIVERY_COUNTRIES_API);

      expect(response).toEqual(MOCK_DELIVERY_COUNTRIES_API);
      expect(req.request.url).toEqual(DELIVERY_COUNTRIES_API_URL);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });
});
