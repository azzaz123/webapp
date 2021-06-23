import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import {
  DeliveryAddressError,
  PhoneNumberIsInvalidError,
  MobilePhoneNumberIsInvalidError,
} from '@private/features/delivery/errors/classes/address';
import { DeliveryErrorApi, DeliveryErrorResponseApi } from '@private/features/delivery/errors/classes/delivery-error-response-api';
import { DeliveryAddressErrorResponse } from '@private/features/delivery/errors/mappers/address/delivery-address-error-mapper';
import { DELIVERY_ADDRESS_ERROR_CODES } from '@private/features/delivery/errors/mappers/address/delivery-address-error.enum';
import { BankAccountErrorResponse } from '@private/features/delivery/errors/mappers/bank-account/bank-account-error-mapper';
import { BANK_ACCOUNT_ERROR_CODES } from '@private/features/delivery/errors/mappers/bank-account/bank-account-error.enum';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorResponse } from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes.error-mapper';

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

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_OWNER_NAME_INVALID: DeliveryErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_OWNER_NAME,
  message: 'Invalid owner name ʕ•́ᴥ•̀ʔっ♡',
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_INVALID: DeliveryErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN_COUNTRY,
  message: 'Invalid IBAN country (ɔ◔‿◔)ɔ ♥',
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_IBAN_INVALID: DeliveryErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN,
  message: 'Invalid IBAN (✿◠‿◠)',
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_PLATFORM_RESPONSE_INVALID: DeliveryErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_PLATFORM_RESPONSE,
  message: 'Invalid platform response ٩(˘◡˘)۶',
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT: DeliveryErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.UNIQUE_BANK_ACCOUNT,
  message: 'rip （っ＾▿＾）',
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

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_INVALID_OWNER_NAME_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_BANK_ACCOUNT_ERROR_OWNER_NAME_INVALID],
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_INVALID],
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_INVALID_IBAN_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_BANK_ACCOUNT_ERROR_IBAN_INVALID],
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_INVALID_PLATFORM_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_BANK_ACCOUNT_ERROR_PLATFORM_RESPONSE_INVALID],
};

export const MOCK_DELIVERY_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
  error: [MOCK_DELIVERY_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT],
};
