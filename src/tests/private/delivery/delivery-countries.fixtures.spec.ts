import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CountryOptionsAndDefault } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';

export const MOCK_DELIVERY_COUNTRIES_API: DeliveryCountriesApi = {
  countries: [
    {
      iso_code: 'ES',
      label: 'Spain',
    },
    {
      iso_code: 'IT',
      label: 'Italy',
    },
  ],
  default: {
    iso_code: 'ES',
  },
};

export const MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT: CountryOptionsAndDefault = {
  countryOptions: [
    {
      label: 'Spain',
      value: 'ES',
    },
    {
      label: 'Italy',
      value: 'IT',
    },
  ],
  defaultCountry: {
    iso_code: 'ES',
  },
};
