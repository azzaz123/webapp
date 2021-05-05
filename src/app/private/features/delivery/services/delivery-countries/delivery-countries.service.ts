import { Injectable } from '@angular/core';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DeliveryCountriesApi, DeliveryCountryApi } from '../../interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesApiService } from '../api/delivery-countries-api/delivery-countries-api.service';

export interface CountryOptionsAndDefault {
  countryOptions: IOption[];
  defaultCountry: DeliveryCountryApi;
}
@Injectable()
export class DeliveryCountriesService {
  private deliveryCountries: BehaviorSubject<DeliveryCountriesApi> = new BehaviorSubject<DeliveryCountriesApi>(null);

  constructor(private deliveryCountriesApiService: DeliveryCountriesApiService) {}

  public get(cache = true): Observable<CountryOptionsAndDefault> {
    if (cache && this.deliveryCountries.value) {
      return of(this.toCountryOptionsAndDefault(this.deliveryCountries.value));
    }
    return this.deliveryCountriesApiService.get().pipe(
      tap((countries: DeliveryCountriesApi) => {
        this.deliveryCountries.next(countries);
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
