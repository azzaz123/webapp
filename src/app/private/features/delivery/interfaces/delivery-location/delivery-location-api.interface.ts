export interface DeliveryLocationApi {
  id: string;
  postal_code: string;
  city: string;
  region: string;
  country_iso_code: DeliveryCountryISOCode;
}

export type DeliveryCountryISOCode = 'ES' | 'IT';
