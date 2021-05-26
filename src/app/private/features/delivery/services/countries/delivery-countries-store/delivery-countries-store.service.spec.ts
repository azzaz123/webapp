import { TestBed } from '@angular/core/testing';
import { DeliveryCountriesStoreService } from './delivery-countries-store.service';
import { MOCK_DELIVERY_COUNTRIES_API } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';

describe('DeliveryCountriesStoreService', () => {
  let service: DeliveryCountriesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryCountriesStoreService],
    });
    service = TestBed.inject(DeliveryCountriesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the delivery countries...', () => {
    beforeEach(() => {
      service.deliveryCountries = MOCK_DELIVERY_COUNTRIES_API;
    });

    it('should update the delivery countries', () => {
      expect(service.deliveryCountries).toEqual(MOCK_DELIVERY_COUNTRIES_API);
    });

    it('should update the delivery countries observable', () => {
      service.deliveryCountries$.subscribe((deliveryCountries: DeliveryCountriesApi) => {
        expect(deliveryCountries).toEqual(MOCK_DELIVERY_COUNTRIES_API);
      });
    });
  });
});
