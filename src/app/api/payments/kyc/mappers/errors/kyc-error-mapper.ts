import {
  DocumentImageIsInvalidError,
  DocumentImageIsInvalidInputFileError,
  DocumentImageSizeExceededError,
  MangopayUserNotFoundError,
  KYCError,
} from '@api/core/errors/payments/kyc';
import { ErrorMapper } from '@api/core/utils/classes';
import { KYCErrorResponseApi } from '../../dtos/errors';
import { KYC_ERROR_CODES } from './kyc-error-codes.enum';

export class KYCErrorMapper extends ErrorMapper<KYCErrorResponseApi> {
  protected generateErrorByRequest(networkError: KYCErrorResponseApi): KYCError[] {
    return this.mapPaymentsCardsErrorResponse(networkError);
  }

  private mapPaymentsCardsErrorResponse(networkError: KYCErrorResponseApi): KYCError[] {
    const mappedErrors: KYCError[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === KYC_ERROR_CODES.MANGOPAY_USER_NOT_FOUND) {
        return mappedErrors.push(new MangopayUserNotFoundError());
      }

      if (error.error_code === KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_SIZE_EXCEEDED) {
        return mappedErrors.push(new DocumentImageSizeExceededError());
      }

      if (error.error_code === KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE) {
        return mappedErrors.push(new DocumentImageIsInvalidInputFileError());
      }

      if (error.error_code === KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_INVALID) {
        return mappedErrors.push(new DocumentImageIsInvalidError());
      }
    });

    return mappedErrors;
  }
}
