import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';

export const MOCK_DELIVERY_ADDRESS_API: DeliveryCountriesApi = {
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
