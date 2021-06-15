import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import {
  DeliveryAddressError,
  PhoneNumberIsInvalidError,
  MobilePhoneNumberIsInvalidError,
} from '@private/features/delivery/errors/classes/address';
import { DeliveryErrorApi, DeliveryErrorResponseApi } from '@private/features/delivery/errors/classes/delivery-error-response-api';
import { DeliveryAddressErrorResponse } from '@private/features/delivery/errors/mappers/address/delivery-address-error-mapper';
import { DELIVERY_ADDRESS_ERROR_CODES } from '@private/features/delivery/errors/mappers/address/delivery-address-error.enum';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorResponse } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes.error-mapper';

export const MOCK_ERROR_RESPONSE: HttpErrorResponse = {
  message: 'Http failure response',
  name: 'HttpErrorResponse',
  ok: false,
  status: 409,
  statusText: 'Conflict',
  url: 'url',
  error: null,
  type: HttpEventType.Response,
  headers: new HttpHeaders(),
};

export const MOCK_DELIVERY_BASE_ERROR_RESPONSE: DeliveryErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_DELIVERY_ADDRESS_ERRORS: DeliveryAddressError[] = [
  new PhoneNumberIsInvalidError(),
  new MobilePhoneNumberIsInvalidError(),
];

export const MOCK_DELIVERY_ADDRESS_ERROR_ADDRESS_TOO_LONG: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG,
  message: 'Delivery address is too long ( ͡° ͜ʖ ͡°)',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_FLAT_AND_FLOOR_TOO_LONG: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.FLAT_AND_FLOOR_TOO_LONG,
  message: 'Flat and floor too long ( ͡° ͜ʖ ͡°)',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_MOBILEPHONE_NUMBER_IS_INVALID: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_MOBILE_PHONE_NUMBER,
  message: 'The contact number must be from the country you are located',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_PHONE_NUMBER_IS_INVALID: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER,
  message: 'The phone number is invalid',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_INVALID: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_POSTAL_CODE,
  message: 'Postal code XXX is not valid',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_DOES_NOT_EXIST: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXIST,
  message: 'Postal code XXX es invent',
};

export const MOCK_DELIVERY_ERROR_POSTAL_CODE_IS_NOT_ALLOWED: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED,
  message: 'Postal code XXX not allowed',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_UNIQUE_ADDRESS_BY_USER: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
  error_code: DELIVERY_ADDRESS_ERROR_CODES.UNIQUE_ADDRESS_BY_USER,
  message: 'Cagada pastorets',
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_INVALID: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
  error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE,
  message: 'Postal code XXX is not valid',
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_DOES_NOT_EXIST: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
  error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXIST,
  message: 'Postal code XXX es invent',
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_NOT_ALLOWED: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
  error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED,
  message: 'Postal code XXX not allowed',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_FLAT_AND_FLOOR_TOO_LONG_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_FLAT_AND_FLOOR_TOO_LONG],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_ADDRESS_TOO_LONG_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_ADDRESS_TOO_LONG],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_MOBILEPHONE_NUMBER_IS_INVALID_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_MOBILEPHONE_NUMBER_IS_INVALID],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_PHONE_NUMBER_IS_INVALID_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_PHONE_NUMBER_IS_INVALID],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_INVALID],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_DOES_NOT_EXIST],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ERROR_POSTAL_CODE_IS_NOT_ALLOWED],
};

export const MOCK_DELIVERY_ADDRESS_ERROR_UNIQUE_ADDRESS_BY_USER_RESPONSE: DeliveryAddressErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_ADDRESS_ERROR_UNIQUE_ADDRESS_BY_USER],
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE: DeliveryPostalCodesErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_DOES_NOT_EXIST],
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE: DeliveryPostalCodesErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_NOT_ALLOWED],
};

export const MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE: DeliveryPostalCodesErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_INVALID],
};
