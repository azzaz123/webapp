import { TestBed } from '@angular/core/testing';
import { DeliveryCountriesStoreService } from './delivery-countries-store.service';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';

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
      service.deliveryCountriesAndDefault = MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT;
    });

    it('should update the delivery countries', () => {
      expect(service.deliveryCountriesAndDefault).toEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
    });

    it('should update the delivery countries observable', () => {
      service.deliveryCountriesAndDefault$.subscribe((deliveryCountries: CountryOptionsAndDefault) => {
        expect(deliveryCountries).toEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
      });
    });
  });
});
