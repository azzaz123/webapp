import { DeliveryAddressError } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_PHONE_NUMBER: DeliveryAddressError = {
  error_code: 'invalid phone number',
  message: 'Phone number 083729100000029 is invalid.',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE: DeliveryAddressError = {
  error_code: 'invalid postal code',
  message: 'Postal code 00000 is invalid.',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER: DeliveryAddressError = {
  error_code: 'invalid mobile phone number',
  message: 'Mobile phone number 083729100000029 is invalid.',
};
