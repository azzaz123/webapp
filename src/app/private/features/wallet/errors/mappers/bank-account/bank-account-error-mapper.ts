import { ErrorMapper } from '@api/core/utils/classes/';
import { BANK_ACCOUNT_ERROR_CODES } from './bank-account-error.enum';
import {
  IbanCountryIsInvalidError,
  IbanIsInvalidError,
  FirstNameIsInvalidError,
  LastNameIsInvalidError,
  PlatformResponseIsInvalidError,
  UniqueBankAccountByUserError,
} from '../../classes/bank-account';
import { WalletErrorResponseApi } from '../../classes/wallet-error-response-api';

export type BankAccountErrorResponse = WalletErrorResponseApi<BANK_ACCOUNT_ERROR_CODES>;

export class BankAccountErrorMapper extends ErrorMapper<BankAccountErrorResponse> {
  protected generateErrorByRequest(networkError: BankAccountErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendWalletErrors } = networkError;

    backendWalletErrors.forEach((error) => {
      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_OWNER_NAME) {
        mappedErrors.push(new FirstNameIsInvalidError());
        mappedErrors.push(new LastNameIsInvalidError());
      }

      if (
        error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN_COUNTRY ||
        error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_COUNTRY_ISO_CODE
      ) {
        mappedErrors.push(new IbanCountryIsInvalidError());
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN) {
        mappedErrors.push(new IbanIsInvalidError());
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_PLATFORM_RESPONSE) {
        mappedErrors.push(new PlatformResponseIsInvalidError(error.message));
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.UNIQUE_BANK_ACCOUNT) {
        mappedErrors.push(new UniqueBankAccountByUserError(error.message));
      }
    });

    return mappedErrors;
  }
}
