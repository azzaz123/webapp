import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  MOCK_DELIVERY_COUNTRIES_API,
  MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT,
} from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { of } from 'rxjs';
import { DeliveryCountriesApiService } from '../../api/delivery-countries-api/delivery-countries-api.service';
import { DeliveryCountriesStoreService } from '../delivery-countries-store/delivery-countries-store.service';
import { DeliveryCountriesService } from './delivery-countries.service';

describe('DeliveryCountriesService', () => {
  let deliveryCountriesStoreService: DeliveryCountriesStoreService;
  let deliveryCountriesApiService: DeliveryCountriesApiService;
  let service: DeliveryCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryCountriesService, DeliveryCountriesApiService, DeliveryCountriesStoreService],
    });

    service = TestBed.inject(DeliveryCountriesService);
    deliveryCountriesApiService = TestBed.inject(DeliveryCountriesApiService);
    deliveryCountriesStoreService = TestBed.inject(DeliveryCountriesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting countries as options and the default one...', () => {
    beforeEach(() => {
      spyOn(deliveryCountriesApiService, 'get').and.returnValue(of(MOCK_DELIVERY_COUNTRIES_API));
    });

    it('should request the countries', () => {
      service.getCountriesAsOptionsAndDefault().subscribe();

      expect(deliveryCountriesApiService.get).toHaveBeenCalled();
    });

    it('should return the requested countries mapped', () => {
      service.getCountriesAsOptionsAndDefault().subscribe((mappedCountries) => {
        expect(mappedCountries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
      });
    });
  });
});
