import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

export const MOCK_DELIVERY_ADDRESS: DeliveryAddressApi = {
  id: '23234',
  full_name: 'Laia',
  street: 'Walla',
  postal_code: '08027',
  city: 'Barcelona',
  region: 'Barcelona',
  country_iso_code: 'ES',
  phone_number: '677594321',
  flat_and_floor: 'Quinto tercera',
};

export const MOCK_INVALID_DELIVERY_ADDRESS: DeliveryAddressApi = {
  id: '23234',
  full_name: 'Lalli',
  street: '',
  postal_code: '',
  city: 'Barcelona',
  region: 'Barcelona',
  country_iso_code: 'ES',
  phone_number: '',
  flat_and_floor: 'Quinto tercera',
};

export const MOCK_DELIVERY_ADDRESS_EMPTY: DeliveryAddressApi = {
  city: '',
  country_iso_code: 'ES',
  flat_and_floor: '',
  full_name: '',
  id: 'FAKE_UUID',
  phone_number: '',
  postal_code: '',
  region: '',
  street: '',
};

export const MOCK_DELIVERY_ADDRESS_2: DeliveryAddressApi = {
  id: '1212',
  full_name: 'Lalli',
  street: 'Wallapop',
  postal_code: '08016',
  city: 'Barcelona',
  region: 'Barcelona',
  country_iso_code: 'ES',
  phone_number: '677594321',
  flat_and_floor: 'Segundo segunda',
};
