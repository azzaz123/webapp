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
    describe('when we have the cache active...', () => {
      describe('and the countries are already stored...', () => {
        beforeEach(() => {
          jest.spyOn(deliveryCountriesStoreService, 'deliveryCountries', 'get').mockReturnValue(MOCK_DELIVERY_COUNTRIES_API);
          spyOn(deliveryCountriesApiService, 'get');
        });

        it(`shouldn't make a new request`, () => {
          service.getCountriesAsOptionsAndDefault().subscribe();

          expect(deliveryCountriesApiService.get).not.toHaveBeenCalled();
        });

        it('should return the stored countries mapped', () => {
          service.getCountriesAsOptionsAndDefault().subscribe((mappedCountries) => {
            expect(mappedCountries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
          });
        });
      });

      describe('and the countries are NOT already stored...', () => {
        beforeEach(() => {
          jest.spyOn(deliveryCountriesStoreService, 'deliveryCountries', 'get').mockReturnValue(null);
          spyOn(deliveryCountriesApiService, 'get').and.returnValue(of(MOCK_DELIVERY_COUNTRIES_API));
        });

        it('should make a new request', () => {
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

    describe(`when we don't have the cache active...`, () => {
      beforeEach(() => {
        jest.spyOn(deliveryCountriesStoreService, 'deliveryCountries', 'get').mockReturnValue(MOCK_DELIVERY_COUNTRIES_API);
        spyOn(deliveryCountriesApiService, 'get').and.returnValue(of(MOCK_DELIVERY_COUNTRIES_API));
      });

      it('should make a new request', () => {
        service.getCountriesAsOptionsAndDefault(false).subscribe();

        expect(deliveryCountriesApiService.get).toHaveBeenCalled();
      });

      it('should return the requested countries mapped', () => {
        service.getCountriesAsOptionsAndDefault(false).subscribe((mappedCountries) => {
          expect(mappedCountries).toStrictEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
        });
      });
    });
  });
});
