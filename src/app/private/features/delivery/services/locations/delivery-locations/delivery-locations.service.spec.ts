import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { of } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationsStoreService } from '../delivery-locations-store/delivery-locations-store.service';

import { DeliveryLocationsService } from './delivery-locations.service';

describe('DeliveryLocationsService', () => {
  const MOCK_POSTAL_CODE = '08027';
  const MOCK_COUNTRY_ISO_CODE = 'ES';
  let service: DeliveryLocationsService;
  let deliveryLocationsApiService: DeliveryLocationsApiService;
  let deliveryLocationsStoreService: DeliveryLocationsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryLocationsService, DeliveryLocationsApiService, DeliveryLocationsStoreService],
    });

    service = TestBed.inject(DeliveryLocationsService);
    deliveryLocationsApiService = TestBed.inject(DeliveryLocationsApiService);
    deliveryLocationsStoreService = TestBed.inject(DeliveryLocationsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the locations only by postal code...', () => {
    beforeEach(() => {
      spyOn(deliveryLocationsApiService, 'get').and.returnValue(of([MOCK_DELIVERY_LOCATION]));

      service.getLocationsByPostalCode(MOCK_POSTAL_CODE).subscribe();
    });

    it('should request the locations', () => {
      expect(deliveryLocationsApiService.get).toHaveBeenCalledWith(MOCK_POSTAL_CODE);
    });

    it('should update the current locations', () => {
      expect(deliveryLocationsStoreService.deliveryLocations).toStrictEqual([MOCK_DELIVERY_LOCATION]);
    });
  });

  describe('when getting the locations by postal code and country...', () => {
    beforeEach(() => {
      spyOn(deliveryLocationsApiService, 'getByPostalCodeAndCountry').and.returnValue(of([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION]));

      service.getLocationsByPostalCodeAndCountry(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE).subscribe();
    });

    it('should request the locations', () => {
      expect(deliveryLocationsApiService.getByPostalCodeAndCountry).toHaveBeenCalledWith(MOCK_POSTAL_CODE, MOCK_COUNTRY_ISO_CODE);
    });

    it('should update the current locations', () => {
      expect(deliveryLocationsStoreService.deliveryLocations).toStrictEqual([MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION]);
    });
  });
});
