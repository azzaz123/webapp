import { IOption } from '@shared/dropdown/utils/option.interface';

export interface DeliveryCountriesApi {
  countries: DeliveryCountryApi[];
  default: DeliveryCountryApi;
}

export interface DeliveryCountryApi {
  iso_code: string;
  label?: string;
  address_restrictions: AddressRestrictionsApi;
}

export interface AddressRestrictionsApi {
  name: number;
  street: number;
  flat_and_floor: number;
}

export interface CountryOptionsAndDefault {
  countryOptions: DeliveryAddressCountryOption[];
  defaultCountry: DeliveryCountryApi;
}

export interface DeliveryAddressCountryOption extends IOption {
  addressFormRestrictions: AddressFormRestrictions;
}

export interface AddressFormRestrictions {
  name: number;
  street: number;
  flat_and_floor: number;
}
