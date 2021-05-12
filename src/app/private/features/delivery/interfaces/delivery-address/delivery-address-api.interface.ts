export interface DeliveryAddressApi {
  id: string;
  full_name: string;
  street: string;
  postal_code: string;
  city: string;
  region: string;
  country_iso_code: DeliveryCountryISOCode;
  phone_number: string;
  flat_and_floor?: string;
}

export type DeliveryCountryISOCode = 'ES' | 'IT';

export enum DELIVERY_ADDRESS_ERROR {
  'invalid phone number' = 'invalid phone number',
  'invalid postal code' = 'invalid postal code',
  'postal code is not allowed' = 'postal code is not allowed',
  'delivery address too long' = 'delivery address too long',
  'flat and floor too long' = 'flat and floor too long',
  'postal code not exists' = 'postal code not exists',
  'invalid mobile phone number' = 'invalid mobile phone number',
}

export interface DeliveryAddressError {
  error_code: DELIVERY_ADDRESS_ERROR | string;
  message: string;
}
