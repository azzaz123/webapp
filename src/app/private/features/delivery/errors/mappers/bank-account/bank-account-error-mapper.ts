import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
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

export type BankAccountErrorResponse = DeliveryErrorResponseApi<BANK_ACCOUNT_ERROR_CODES>;

export class BankAccountErrorMapper extends ErrorMapper<BankAccountErrorResponse> {
  protected generateErrorByRequest(networkError: BankAccountErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_OWNER_NAME) {
        mappedErrors.push(new FirstNameIsInvalidError());
        mappedErrors.push(new LastNameIsInvalidError());
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN_COUNTRY) {
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
