import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';

export const MOCK_DELIVERY_LOCATION: DeliveryLocationApi = {
  id: '123',
  postal_code: '08027',
  city: 'Barcelona',
  region: 'Barcelona',
  country_iso_code: 'ES',
};

export const MOCK_DELIVERY_LOCATION_AS_OPTION: IOption = {
  label: MOCK_DELIVERY_LOCATION.city,
  value: MOCK_DELIVERY_LOCATION.city,
};

export const MOCK_DELIVERY_LOCATION_ES: DeliveryLocationApi = {
  id: '156',
  postal_code: '00122',
  city: 'Málaga',
  region: 'Málaga',
  country_iso_code: 'ES',
};

export const MOCK_DELIVERY_LOCATION_IT: DeliveryLocationApi = {
  id: '156',
  postal_code: '00122',
  city: 'Roma',
  region: 'Lazio',
  country_iso_code: 'IT',
};
