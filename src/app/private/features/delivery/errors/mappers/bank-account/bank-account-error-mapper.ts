import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
import { ErrorMapper } from '../error-mapper';
import { BANK_ACCOUNT_ERROR_CODES } from './bank-account-error.enum';

export type BankAccountErrorResponse = DeliveryErrorResponseApi<BANK_ACCOUNT_ERROR_CODES>;

export class BankAccountErrorMapper extends ErrorMapper<BankAccountErrorResponse> {
  protected generateErrorByRequest(networkError: BankAccountErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_OWNER_NAME) {
        mappedErrors.push();
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN_COUNTRY) {
        mappedErrors.push();
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_IBAN) {
        mappedErrors.push();
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.INVALID_PLATFORM_RESPONSE) {
        mappedErrors.push();
      }

      if (error.error_code === BANK_ACCOUNT_ERROR_CODES.UNIQUE_BANK_ACCOUNT) {
        mappedErrors.push();
      }
    });

    return mappedErrors;
  }
}
