import { IOption } from '@shared/dropdown/utils/option.interface';

export interface DeliveryCountriesApi {
  countries: DeliveryCountryApi[];
  default: DeliveryCountryApi;
}

export interface DeliveryCountryApi {
  iso_code: string;
  label?: string;
}

export interface CountryOptionsAndDefault {
  countryOptions: IOption[];
  defaultCountry: DeliveryCountryApi;
}
