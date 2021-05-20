import {
  INVALID_DELIVERY_ADDRESS_CODE,
  INVALID_DELIVERY_ADDRESS_POSTAL_CODE,
} from '@private/features/delivery/errors/delivery-address/delivery-address-error';

export const MOCK_DELIVERY_ADDRESS_ERRORS_API = {
  status: INVALID_DELIVERY_ADDRESS_CODE,
  error: [
    { error_code: 'invalid mobile phone number', message: '' },
    { error_code: 'invalid postal code', message: '' },
  ],
};

export const MOCK_DELIVERY_ADDRESS_ERRORS_INVALID_POSTAL_CODE_API = {
  status: INVALID_DELIVERY_ADDRESS_POSTAL_CODE,
  error: [{ error_code: 'invalid postal code', message: '' }],
};
