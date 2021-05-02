export interface DeliveryCountriesApi {
  countries: DeliveryCountryApi[];
  default: DeliveryCountryApi;
}

export interface DeliveryCountryApi {
  iso_code: string;
  label?: string;
}
