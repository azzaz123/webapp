import { CardIsNotAuthorizedError, CardOwnerNameIsInvalidError, PaymentsCardsError } from '@api/core/errors/payments/cards';
import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import {
  MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX,
  PaymentsCardsErrorResponseApi,
} from '@api/payments/cards/dtos/errors/payments-cards-error-response-api.interface';
import { MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM } from '@api/payments/cards/mappers/errors/mangopay-card-registration-error-codes.enum';
import { PAYMENTS_CARDS_ERROR_CODES } from '@api/payments/cards/mappers/errors/payments-cards-error-codes.enum';
import { PaymentsErrorApi, PaymentsErrorResponseApi } from '@api/payments/dtos/errors';

export const MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE: PaymentsErrorResponseApi<unknown> = {
  ...MOCK_ERROR_RESPONSE,
  error: [{ error_code: 'unknown', message: 'rip' }],
};

export const MOCK_PAYMENTS_CARDS_ERRORS: PaymentsCardsError[] = [new CardOwnerNameIsInvalidError(), new CardIsNotAuthorizedError()];

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_COUNTRY_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_COUNTRY_IS_INVALID,
  message: 'Sorry, Catalunya is not Spain ( ͡° ͜ʖ ͡°)',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_IS_NOT_AUTHORIZED: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_IS_NOT_AUTHORIZED,
  message: 'You need the black card in order to proceed',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_NOT_FOUND: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_NOT_FOUND,
  message: 'Card was not found :/',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_IS_INVALID,
  message: 'Card owner is invalid',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_NAME_IS_INVALID,
  message: 'Card owner name is invalid',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_FAILED: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_FAILED,
  message: 'Card registration failed',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_IS_INVALID,
  message: 'Card registration is invalid',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_TOKENIZATION_FAILED: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.CARD_TOKENIZATION_FAILED,
  message: 'Card tokenization failed. Sumimasen.',
};

export const MOCK_PAYMENTS_CARDS_ERROR_COUNTRY_ISO_CODE_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.COUNTRY_ISO_CODE_IS_INVALID,
  message: 'Country ISO code is not valid, wtf',
};

export const MOCK_PAYMENTS_CARDS_ERROR_PLATFORM_RESPONSE_IS_INVALID: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.PLATFORM_RESPONSE_IS_INVALID,
  message: 'Platform response is invalid',
};

export const MOCK_PAYMENTS_CARDS_ERROR_UNIQUE_CARD_FOR_USER: PaymentsErrorApi<PAYMENTS_CARDS_ERROR_CODES> = {
  error_code: PAYMENTS_CARDS_ERROR_CODES.UNIQUE_CARD_FOR_USER,
  message: 'Unique card for user violation :x',
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_COUNTRY_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_COUNTRY_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_IS_NOT_AUTHORIZED_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_IS_NOT_AUTHORIZED],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_NOT_FOUND_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_NOT_FOUND],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_FAILED_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_FAILED],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_CARD_TOKENIZATION_FAILED_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_CARD_TOKENIZATION_FAILED],
};

export const MOCK_PAYMENTS_CARDS_ERROR_COUNTRY_ISO_CODE_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_COUNTRY_ISO_CODE_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_PLATFORM_RESPONSE_IS_INVALID_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_PLATFORM_RESPONSE_IS_INVALID],
};

export const MOCK_PAYMENTS_CARDS_ERROR_UNIQUE_CARD_FOR_USER_RESPONSE: PaymentsCardsErrorResponseApi = {
  ...MOCK_PAYMENTS_CARDS_BASE_ERROR_RESPONSE,
  error: [MOCK_PAYMENTS_CARDS_ERROR_UNIQUE_CARD_FOR_USER],
};

export const mockInvalidCardNumberCardTokenizerErrorResponse = `${MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX}=${MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.INVALID_CARD_NUMBER}`;
