import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { DeliveryAddressError } from '@private/features/delivery/errors/delivery-address/delivery-address-error';
import { of, throwError } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import {
  MOCK_DELIVERY_ADDRESS_ERRORS_API,
  MOCK_DELIVERY_ADDRESS_ERRORS_INVALID_POSTAL_CODE_API,
} from '@fixtures/private/delivery/delivery-address-error.fixtures.spec';
import { DeliveryLocationsService } from './delivery-locations.service';
import { DELIVERY_ADDRESS_ERROR } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';

describe('DeliveryLocationsService', () => {
  const MOCK_POSTAL_CODE = '08027';
  const MOCK_COUNTRY_ISO_CODE = 'ES';
  let service: DeliveryLocationsService;
  let deliveryLocationsApiService: DeliveryLocationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryLocationsService, DeliveryLocationsApiService],
    });

    service = TestBed.inject(DeliveryLocationsService);
    deliveryLocationsApiService = TestBed.inject(DeliveryLocationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the locations by postal code and country...', () => {
    describe('and the petition succeed...', () => {
      beforeEach(() => {
        spyOn(deliveryLocationsApiService, 'getByPostalCodeAndCountry').and.returnValue(
          of([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION])
        );

        service.getLocationsByPostalCodeAndCountry(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE).subscribe();
      });

      it('should request the locations', () => {
        expect(deliveryLocationsApiService.getByPostalCodeAndCountry).toHaveBeenCalledWith(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE);
      });
    });

    describe('and the petition fails...', () => {
      describe('and the invalid code is the invalid postal code one (500)...', () => {
        it('should map the error to DeliveryAddressError with custom error code', () => {
          let response: DeliveryAddressError[];
          spyOn(deliveryLocationsApiService, 'getByPostalCodeAndCountry').and.returnValue(
            throwError(MOCK_DELIVERY_ADDRESS_ERRORS_INVALID_POSTAL_CODE_API)
          );

          service.getLocationsByPostalCodeAndCountry(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE).subscribe({
            error: (deliveryAddressErrors: DeliveryAddressError[]) => {
              response = deliveryAddressErrors;
            },
          });

          response.forEach((error) => {
            expect(error instanceof DeliveryAddressError).toBeTruthy();
            expect(error.error_code).toBe(DELIVERY_ADDRESS_ERROR['invalid postal code']);
          });
        });
      });

      it('should map the error to DeliveryAddressError', () => {
        let response: DeliveryAddressError[];
        spyOn(deliveryLocationsApiService, 'getByPostalCodeAndCountry').and.returnValue(throwError(MOCK_DELIVERY_ADDRESS_ERRORS_API));

        service.getLocationsByPostalCodeAndCountry(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE).subscribe({
          error: (deliveryAddressErrors: DeliveryAddressError[]) => {
            response = deliveryAddressErrors;
          },
        });

        response.forEach((error) => {
          expect(error instanceof DeliveryAddressError).toBeTruthy();
        });
      });
    });
  });
});
