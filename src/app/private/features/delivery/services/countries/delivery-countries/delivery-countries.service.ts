import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getCountriesAsOptionsAndDefault(): Observable<CountryOptionsAndDefault> {
    return this.deliveryCountriesApiService.get().pipe(
      map((countries: DeliveryCountriesApi) => this.mapCountryOptionsAndDefaultCountry(countries)),
      tap((mappedCountries: CountryOptionsAndDefault) => {
        this.deliveryCountriesStoreService.deliveryCountriesAndDefault = mappedCountries;
      })
    );
  }

  private mapCountryOptionsAndDefaultCountry(countries: DeliveryCountriesApi): CountryOptionsAndDefault {
    return {
      countryOptions: this.mapCountryOptions(countries),
      defaultCountry: {
        isoCode: countries.default.iso_code,
      },
    };
  }

  private mapCountryOptions(values: DeliveryCountriesApi): DeliveryAddressCountryOption[] {
    return values.countries.map((country: DeliveryCountryApi) => this.mapCountryOption(country));
  }

  private mapCountryOption(deliveryCountryApi: DeliveryCountryApi): DeliveryAddressCountryOption {
    return {
      value: deliveryCountryApi.iso_code,
      label: deliveryCountryApi.label,
      addressFormRestrictions: {
        full_name: deliveryCountryApi.address_restrictions.name,
        street: deliveryCountryApi.address_restrictions.street,
        flat_and_floor: deliveryCountryApi.address_restrictions.flat_and_floor,
      },
    };
  }
}
