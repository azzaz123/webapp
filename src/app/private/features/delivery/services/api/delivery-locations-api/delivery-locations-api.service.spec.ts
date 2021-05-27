import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { DeliveryLocationsApiService, DELIVERY_LOCATIONS_API_URL } from './delivery-locations-api.service';

describe('DeliveryLocationsApiService', () => {
  const postalCode = '08027';
  const countryISOCode = 'ES';
  let service: DeliveryLocationsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryLocationsApiService],
    });
    service = TestBed.inject(DeliveryLocationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting delivery location by postal code and country...', () => {
    it('should send a petition to get the delivery locations', () => {
      const expectedUrl = `${DELIVERY_LOCATIONS_API_URL}?postal_code=${postalCode}&country_iso_code=${countryISOCode}`;
      let response: DeliveryLocationApi[];

      service.getByPostalCodeAndCountry(postalCode, countryISOCode).subscribe((data: DeliveryLocationApi[]) => {
        response = data;
      });
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION]);

      expect(response).toEqual([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION]);
      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
