import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { DeliveryPostalCodesError, PostalCodeIsInvalidError } from '@private/features/delivery/errors/classes/postal-codes';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes-error.enum';
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
    const expectedUrl = `${DELIVERY_LOCATIONS_API_URL}?postal_code=${postalCode}&country_iso_code=${countryISOCode}`;

    it('should send a petition to get the delivery locations', () => {
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

    describe('and when there is an unknown error from server', () => {
      it('should map to generic error', () => {
        let response: DeliveryPostalCodesError[];

        service.getByPostalCodeAndCountry(postalCode, countryISOCode).subscribe({
          error: (errorResponse: DeliveryPostalCodesError[]) => {
            response = errorResponse;
          },
        });
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.error([{ error_code: 'unknown', message: 'rip' }] as any);

        expect(response[0] instanceof Error).toBe(true);
      });
    });

    describe('and when there is a known error from server', () => {
      it('should map to specific error', () => {
        let response: DeliveryPostalCodesError[];

        service.getByPostalCodeAndCountry(postalCode, countryISOCode).subscribe({
          error: (errorResponse: DeliveryPostalCodesError[]) => (response = errorResponse),
        });
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.error([{ error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE, message: 'rip' }] as any);

        expect(response[0] instanceof PostalCodeIsInvalidError).toBe(true);
      });
    });
  });
});
