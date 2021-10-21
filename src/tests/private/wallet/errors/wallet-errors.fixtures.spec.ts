import { MOCK_ERROR_RESPONSE } from '@api/fixtures/error-response-api.fixtures.spec';
import { WalletErrorApi, WalletErrorResponseApi } from '@private/features/wallet/errors/classes/wallet-error-response-api';
import { BankAccountErrorResponse } from '@private/features/wallet/errors/mappers/bank-account/bank-account-error-mapper';
import { BANK_ACCOUNT_ERROR_CODES } from '@private/features/wallet/errors/mappers/bank-account/bank-account-error.enum';

export const MOCK_WALLET_BASE_ERROR_RESPONSE: WalletErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_OWNER_NAME_INVALID: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_OWNER_NAME,
  message: 'Invalid owner name ʕ•́ᴥ•̀ʔっ♡',
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_INVALID: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN_COUNTRY,
  message: 'Invalid IBAN country (ɔ◔‿◔)ɔ ♥',
};
export const MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_ISO_CODE_INVALID: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_COUNTRY_ISO_CODE,
  message: 'Invalid IBAN country iso code (ɔ◔‿◔)ɔ ♥',
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_INVALID: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN,
  message: 'Invalid IBAN (✿◠‿◠)',
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_PLATFORM_RESPONSE_INVALID: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.INVALID_PLATFORM_RESPONSE,
  message: 'Invalid platform response ٩(˘◡˘)۶',
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT: WalletErrorApi<BANK_ACCOUNT_ERROR_CODES> = {
  error_code: BANK_ACCOUNT_ERROR_CODES.UNIQUE_BANK_ACCOUNT,
  message: 'rip （っ＾▿＾）',
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_OWNER_NAME_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_OWNER_NAME_INVALID],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_INVALID],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_INVALID],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_PLATFORM_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_PLATFORM_RESPONSE_INVALID],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT],
};

export const MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_ISO_CODE_RESPONSE: BankAccountErrorResponse = {
  ...MOCK_WALLET_BASE_ERROR_RESPONSE,
  error: [MOCK_WALLET_BANK_ACCOUNT_ERROR_IBAN_COUNTRY_ISO_CODE_INVALID],
};
