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
