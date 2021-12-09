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
        name: 12,
        street: 33,
        flat_and_floor: 3,
      },
    },
    {
      iso_code: 'IT',
      label: 'Italy',
      address_restrictions: {
        name: 11,
        street: 41,
        flat_and_floor: 50,
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
        name: 5,
        street: 4,
        flat_and_floor: 10,
      },
    },
    {
      label: 'Italy',
      value: 'IT',
      addressFormRestrictions: {
        name: 5,
        street: 4,
        flat_and_floor: 10,
      },
    },
  ],
  defaultCountry: {
    isoCode: 'ES',
  },
};
