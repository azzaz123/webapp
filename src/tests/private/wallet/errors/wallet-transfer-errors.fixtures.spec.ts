import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import { WalletErrorApi, WalletErrorResponseApi } from '@private/features/wallet/errors/classes/wallet-error-response-api';
import { WalletTransferErrorEnum } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error.enum';
import { WalletTransferErrorResponse } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';

export const MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE: WalletErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.AlreadyStarted,
  message: 'pay user bank account already started',
};

export const MOCK_WALLET_TRANSFER_INSUFFICIENT_FUNDS_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.InsufficientFunds,
  message: 'mangopay pay user bank account from user wallet insufficient funds',
};

export const MOCK_WALLET_TRANSFER_LESS_THAN_MINIMUM_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.LessThanMinimum,
  message: 'mangopay pay user bank account from user wallet less than minimum',
};

export const MOCK_WALLET_TRANSFER_NETWORK_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.Network,
  message: 'network error',
};

export const MOCK_WALLET_TRANSFER_USER_NOT_FOUND_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.UserNotFound,
  message: 'mangopay bank account for user not found',
};

export const MOCK_WALLET_TRANSFER_WALLET_BLOCKED_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: WalletTransferErrorEnum.WalletBlocked,
  message: "pay user bank account user's wallet blocked",
};

export const MOCK_WALLET_TRANSFER_UNKNOWN_ERROR: WalletErrorApi<WalletTransferErrorEnum> = {
  error_code: 'unknown' as WalletTransferErrorEnum,
  message: 'unknown',
};

export const MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR],
};

export const MOCK_WALLET_TRANSFER_INSUFFICIENT_FUNDS_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_INSUFFICIENT_FUNDS_ERROR],
};

export const MOCK_WALLET_TRANSFER_LESS_THAN_MINIMUM_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_LESS_THAN_MINIMUM_ERROR],
};

export const MOCK_WALLET_TRANSFER_NETWORK_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_NETWORK_ERROR],
};

export const MOCK_WALLET_TRANSFER_USER_NOT_FOUND_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_USER_NOT_FOUND_ERROR],
};

export const MOCK_WALLET_TRANSFER_WALLET_BLOCKED_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_WALLET_BLOCKED_ERROR],
};

export const MOCK_WALLET_TRANSFER_UNKNOWN_ERROR_RESPONSE: WalletTransferErrorResponse = {
  ...MOCK_WALLET_TRANSFER_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_TRANSFER_UNKNOWN_ERROR],
};
