import {
  CountryOptionsAndDefault,
  DeliveryCountriesApi,
} from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';

export const MOCK_DELIVERY_COUNTRIES_API: DeliveryCountriesApi = {
  countries: [
    {
      iso_code: 'ES',
      label: 'Spain',
      address_restrictions: {
        name: 35,
        street: 30,
        flat_and_floor: 9,
      },
    },
    {
      iso_code: 'IT',
      label: 'Italy',
      address_restrictions: {
        name: 45,
        street: 40,
        flat_and_floor: 19,
      },
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
      addressFormRestrictions: {
        full_name: 35,
        street: 30,
        flat_and_floor: 9,
      },
    },
    {
      label: 'Italy',
      value: 'IT',
      addressFormRestrictions: {
        full_name: 45,
        street: 40,
        flat_and_floor: 19,
      },
    },
  ],
  defaultCountry: {
    isoCode: 'ES',
  },
};
