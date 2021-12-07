import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CountryOptionsAndDefault,
  DeliveryAddressCountryOption,
  DeliveryCountriesApi,
  DeliveryCountryApi,
} from '../../../interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesApiService } from '../../api/delivery-countries-api/delivery-countries-api.service';
import { DeliveryCountriesStoreService } from '../delivery-countries-store/delivery-countries-store.service';

@Injectable()
export class DeliveryCountriesService {
  constructor(
    private deliveryCountriesApiService: DeliveryCountriesApiService,
    private deliveryCountriesStoreService: DeliveryCountriesStoreService
  ) {}

  public getCountriesAsOptionsAndDefault(cache = true): Observable<CountryOptionsAndDefault> {
    const storedCountries = this.deliveryCountriesStoreService.deliveryCountries;

    if (cache && storedCountries) {
      return of(this.toCountryOptionsAndDefault(storedCountries));
    }

    return this.deliveryCountriesApiService.get().pipe(
      tap((countries: DeliveryCountriesApi) => {
        this.deliveryCountriesStoreService.deliveryCountries = countries;
      }),
      map((countries: DeliveryCountriesApi) => {
        return this.toCountryOptionsAndDefault(countries);
      })
    );
  }

  private toCountryOptionsAndDefault(countries: DeliveryCountriesApi): CountryOptionsAndDefault {
    return {
      countryOptions: this.toSelectOptions(countries),
      defaultCountry: countries.default,
    };
  }

  private toSelectOptions(values: DeliveryCountriesApi): DeliveryAddressCountryOption[] {
    return values.countries.map((country: DeliveryCountryApi) => ({
      value: country.iso_code,
      label: country.label,
      addressFormRestrictions: {
        name: country.address_restrictions.name,
        street: country.address_restrictions.street,
        flat_and_floor: country.address_restrictions.flat_and_floor,
      },
    }));
  }
}
