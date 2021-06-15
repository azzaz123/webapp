import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { of } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';

import { DeliveryLocationsService } from './delivery-locations.service';

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
  });
});
