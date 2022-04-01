import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import { BuyRequestErrorDto, BuyRequestErrorResponse } from '@api/delivery/buyer/requests/dtos/errors';
import { BUY_REQUEST_ERROR_CODES } from '@api/delivery/buyer/requests/mappers/errors/buy-request/buy-request-error-codes.enum';

const MOCK_BASE_ERROR_RESPONSE: BuyRequestErrorResponse = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

const MOCK_NO_ADDRESS_FOR_USER_ERROR: BuyRequestErrorDto = {
  error_code: BUY_REQUEST_ERROR_CODES.NO_ADDRESS_FOR_USER,
  message: 'SDHSIDUSD ♥',
};

export const MOCK_NO_ADDRESS_FOR_USER_ERROR_RESPONSE: BuyRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_NO_ADDRESS_FOR_USER_ERROR],
};

const MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR: BuyRequestErrorDto = {
  error_code: BUY_REQUEST_ERROR_CODES.NO_CARRIER_OFFICE_ADDRESS_FOR_USER,
  message: 'sidjisd ♥',
};

export const MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE: BuyRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR],
};

const MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR: BuyRequestErrorDto = {
  error_code: BUY_REQUEST_ERROR_CODES.ALREADY_IN_PROGRESS_TRANSACTION,
  message: 'sidjisd ♥',
};

export const MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE: BuyRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR],
};

const MOCK_DUPLICATED_REQUEST_ERROR: BuyRequestErrorDto = {
  error_code: BUY_REQUEST_ERROR_CODES.DUPLICATED_REQUEST,
  message: 'sidjisd ♥',
};

export const MOCK_DUPLICATED_REQUEST_ERROR_RESPONSE: BuyRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_DUPLICATED_REQUEST_ERROR],
};
