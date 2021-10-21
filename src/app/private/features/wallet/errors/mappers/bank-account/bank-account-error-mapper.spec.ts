import {
  MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_ISO_CODE_RESPONSE,
  MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_RESPONSE,
  MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_RESPONSE,
  MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_OWNER_NAME_RESPONSE,
  MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_PLATFORM_RESPONSE,
  MOCK_WALLET_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT_RESPONSE,
} from '@fixtures/private/wallet/errors/wallet-errors.fixtures.spec';
import {
  BankAccountError,
  FirstNameIsInvalidError,
  IbanCountryIsInvalidError,
  IbanIsInvalidError,
  LastNameIsInvalidError,
  PlatformResponseIsInvalidError,
  UniqueBankAccountByUserError,
} from '../../classes/bank-account';
import { BankAccountErrorMapper } from './bank-account-error-mapper';

const bankAccountErrorMapper = new BankAccountErrorMapper();

describe('when mapping an error from bank account backend', () => {
  describe('and server notifies owner name invalid error', () => {
    it('should notify first name and last name error', () => {
      let results: BankAccountError[];

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_OWNER_NAME_RESPONSE).subscribe({
        error: (errors) => (results = errors),
      });

      expect(results[0] instanceof FirstNameIsInvalidError).toBe(true);
      expect(results[1] instanceof LastNameIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies iban country invalid error', () => {
    it('should notify invalid iban country error', () => {
      let result: BankAccountError;

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof IbanCountryIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies iban invalid error', () => {
    it('should notify invalid iban error', () => {
      let result: BankAccountError;

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof IbanIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies platform response invalid error', () => {
    it('should notify invalid platform response error', () => {
      let result: BankAccountError;

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_PLATFORM_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PlatformResponseIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies unique bank account by user error', () => {
    it('should notify unique bank account response error', () => {
      let result: BankAccountError;

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_UNIQUE_BANK_ACCOUNT_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof UniqueBankAccountByUserError).toBe(true);
    });
  });

  describe('and server notifies invalid country code error', () => {
    it('should notify invalid iban country error', () => {
      let result: BankAccountError;

      bankAccountErrorMapper.map(MOCK_WALLET_BANK_ACCOUNT_ERROR_INVALID_IBAN_COUNTRY_ISO_CODE_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof IbanCountryIsInvalidError).toBe(true);
    });
  });
});
