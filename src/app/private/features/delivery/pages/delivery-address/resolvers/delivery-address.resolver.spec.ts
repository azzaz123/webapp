import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { of } from 'rxjs';
import { DeliveryAddressResolver } from './delivery-address.resolver';

describe('DeliveryAddressResolver', () => {
  let resolver: DeliveryAddressResolver;
  let deliveryCountries: DeliveryCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryAddressResolver,
        {
          provide: DeliveryCountriesService,
          useValue: {
            getCountriesAsOptionsAndDefault() {
              return of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
            },
          },
        },
      ],
    });

    resolver = TestBed.inject(DeliveryAddressResolver);
    deliveryCountries = TestBed.inject(DeliveryCountriesService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return Observable with Country Options And Default', () => {
    let countryOptionsAndDefault: CountryOptionsAndDefault;
    spyOn(deliveryCountries, 'getCountriesAsOptionsAndDefault').and.callThrough();

    resolver.resolve().subscribe((result: CountryOptionsAndDefault) => {
      countryOptionsAndDefault = result;
    });

    expect(deliveryCountries.getCountriesAsOptionsAndDefault).toHaveBeenCalled();
    expect(countryOptionsAndDefault).toEqual(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
  });
});
