import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

export const MOCK_DELIVERY_ADDRESS: DeliveryAddress = {
  city: 'Montserrat',
  country: 'ES',
  flatAndFloor: '6, 1',
  fullName: 'buyer jtrx.',
  id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
  phoneNumber: '666666666',
  postalCode: '08199',
  region: 'Barcelona',
  street: 'calle jtrx',
};

export const MOCK_DELIVERY_ADDRESS_API: DeliveryAddressApi = {
  city: 'Montserrat',
  country_iso_code: 'ES',
  flat_and_floor: '6, 1',
  full_name: 'buyer jtrx.',
  id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
  phone_number: '666666666',
  postal_code: '08199',
  region: 'Barcelona',
  street: 'calle jtrx',
};
