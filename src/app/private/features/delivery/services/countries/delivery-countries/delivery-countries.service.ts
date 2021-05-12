import { Injectable } from '@angular/core';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DeliveryCountriesApi, DeliveryCountryApi } from '../../../interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesApiService } from '../../api/delivery-countries-api/delivery-countries-api.service';
import { DeliveryCountriesStoreService } from '../delivery-countries-store/delivery-countries-store.service';

export interface CountryOptionsAndDefault {
  countryOptions: IOption[];
  defaultCountry: DeliveryCountryApi;
}
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

  private toSelectOptions(values: DeliveryCountriesApi): IOption[] {
    return values.countries.map((country: DeliveryCountryApi) => ({
      value: country.iso_code,
      label: country.label,
    }));
  }
}
