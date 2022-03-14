import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import { AcceptRequestErrorResponse, AcceptRequestErrorDto } from '@api/delivery/seller/requests/dtos/errors';
import { ACCEPT_REQUEST_ERROR_CODES } from '@api/delivery/seller/requests/mappers/errors/accept-request/accept-request-error-codes.enum';

const MOCK_BASE_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.NON_PURCHASABLE_ITEM,
  message: 'SDHSIDUSD ♥',
};

export const MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR],
};

const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_FOUND_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_FOUND,
  message: 'sdsdsdsdf ♥',
};

export const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_FOUND_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_FOUND_ERROR],
};

const MOCK_ACCEPT_SCREEN_ALREADY_IN_PROGRESS_TRANSACTION_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.ALREADY_IN_PROGRESS_TRANSACTION,
  message: ' fgrgdfgsd♥',
};

export const MOCK_ACCEPT_SCREEN_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_ALREADY_IN_PROGRESS_TRANSACTION_ERROR],
};

const MOCK_ACCEPT_SCREEN_SELLER_BLOCK_FOR_FRAUD_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCK_FOR_FRAUD,
  message: ' 5trsdfvg♥',
};

export const MOCK_ACCEPT_SCREEN_SELLER_BLOCK_FOR_FRAUD_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_SELLER_BLOCK_FOR_FRAUD_ERROR],
};

const MOCK_ACCEPT_SCREEN_BUYER_BLOCK_FOR_FRAUD_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCK_FOR_FRAUD,
  message: 'sdgfretrgds ♥',
};

export const MOCK_ACCEPT_SCREEN_BUYER_BLOCK_FOR_FRAUD_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_BUYER_BLOCK_FOR_FRAUD_ERROR],
};

const MOCK_ACCEPT_SCREEN_INVALID_CARD_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.INVALID_CARD,
  message: '4e5rsfdsdf ♥',
};

export const MOCK_ACCEPT_SCREEN_INVALID_CARD_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_INVALID_CARD_ERROR],
};

const MOCK_ACCEPT_SCREEN_SELLER_BLOCKED_BY_BUYER_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCKED_BY_BUYER,
  message: '5trdgfgsd ♥',
};

export const MOCK_ACCEPT_SCREEN_SELLER_BLOCKED_BY_BUYER_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_SELLER_BLOCKED_BY_BUYER_ERROR],
};

const MOCK_ACCEPT_SCREEN_BUYER_BLOCKED_BY_SELLER_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCKED_BY_SELLER,
  message: 'jhgdsrts ♥',
};

export const MOCK_ACCEPT_SCREEN_BUYER_BLOCKED_BY_SELLER_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_BUYER_BLOCKED_BY_SELLER_ERROR],
};

const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_ALLOWED_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_ALLOWED,
  message: 'wefdvfh ♥',
};

export const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_ALLOWED_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_ALLOWED_ERROR],
};

const MOCK_ACCEPT_SCREEN_REQUEST_NOT_FOUND_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.REQUEST_NOT_FOUND,
  message: 'etrdfhggj ♥',
};

export const MOCK_ACCEPT_SCREEN_REQUEST_NOT_FOUND_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_REQUEST_NOT_FOUND_ERROR],
};

export const MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_FOUND,
  message: 'dfgdrtres ♥',
};

export const MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR],
};

const MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_ALLOWED_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_ALLOWED,
  message: 'fthdtrd ♥',
};

export const MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_ALLOWED_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_ALLOWED_ERROR],
};

const MOCK_ACCEPT_SCREEN_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_TEMPORARILY_RESTRICTED,
  message: 'dfghsew ♥',
};

export const MOCK_ACCEPT_SCREEN_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR],
};

const MOCK_ACCEPT_SCREEN_IS_NOT_PENDING_REQUEST_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.IS_NOT_PENDING_REQUEST,
  message: 'sdrgrsdfh ♥',
};

export const MOCK_ACCEPT_SCREEN_IS_NOT_PENDING_REQUEST_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_IS_NOT_PENDING_REQUEST_ERROR],
};

const MOCK_ACCEPT_SCREEN_CARRIER_ADDRESSES_DONT_MATCH_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.CARRIER_ADDRESSES_DONT_MATCH,
  message: 'wrthfg ♥',
};

export const MOCK_ACCEPT_SCREEN_CARRIER_ADDRESSES_DONT_MATCH_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_CARRIER_ADDRESSES_DONT_MATCH_ERROR],
};

const MOCK_ACCEPT_SCREEN_NOT_SHIPPABLE_ITEM_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.NOT_SHIPPABLE_ITEM,
  message: 'fth ♥',
};

export const MOCK_ACCEPT_SCREEN_NOT_SHIPPABLE_ITEM_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_NOT_SHIPPABLE_ITEM_ERROR],
};

const MOCK_ACCEPT_SCREEN_INTERNATIONAL_SHIPPING_NOT_ENABLED_ERROR: AcceptRequestErrorDto = {
  error_code: ACCEPT_REQUEST_ERROR_CODES.INTERNATIONAL_SHIPPING_NOT_ENABLED,
  message: 'ghgh ♥',
};

export const MOCK_ACCEPT_SCREEN_INTERNATIONAL_SHIPPING_NOT_ENABLED_ERROR_RESPONSE: AcceptRequestErrorResponse = {
  ...MOCK_BASE_ERROR_RESPONSE,
  error: [MOCK_ACCEPT_SCREEN_INTERNATIONAL_SHIPPING_NOT_ENABLED_ERROR],
};