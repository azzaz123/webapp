import { IOption } from '@shared/dropdown/utils/option.interface';

export interface DeliveryCountriesApi {
  countries: DeliveryCountryApi[];
  default: DeliveryCountryDefaultApi;
}

export interface DeliveryCountryDefaultApi {
  iso_code: string;
}
export interface DeliveryCountryApi extends DeliveryCountryDefaultApi {
  label: string;
  address_restrictions: AddressRestrictionsApi;
}

export interface AddressRestrictionsApi {
  name: number;
  street: number;
  flat_and_floor: number;
}

export interface CountryOptionsAndDefault {
  countryOptions: DeliveryAddressCountryOption[];
  defaultCountry: DeliveryCountryDefault;
}

export interface DeliveryCountryDefault {
  isoCode: string;
}

export interface DeliveryAddressCountryOption extends IOption {
  addressFormRestrictions: AddressFormRestrictions;
}

export interface AddressFormRestrictions {
  name: number;
  street: number;
  flat_and_floor: number;
}
