import {
  DocumentImageIsInvalidError,
  DocumentImageIsInvalidInputFileError,
  DocumentImageSizeExceededError,
  MangopayUserNotFoundError,
  KYCError,
} from '@api/core/errors/payments/kyc';
import { ErrorMapper } from '@api/core/utils/classes';
import { KYCErrorApi, KYCErrorResponseApi, KYCErrorResponseApiMapped } from '../../dtos/errors';
import { KYC_ERROR_CODES } from './kyc-error-codes.enum';

export class KYCErrorMapper extends ErrorMapper<KYCErrorResponseApi> {
  protected generateErrorByRequest(networkError: KYCErrorResponseApi): KYCError[] {
    return this.mapKYCErrorResponse(this.mapNetworkError(networkError));
  }

  private mapKYCErrorResponse(networkError: KYCErrorResponseApiMapped): KYCError[] {
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

  private mapNetworkError(networkError: KYCErrorResponseApi): KYCErrorResponseApiMapped {
    if (this.isString(networkError.error)) {
      networkError.error = JSON.parse(networkError.error);
    }

    return networkError as KYCErrorResponseApiMapped;
  }

  private isString(networkError: KYCErrorApi[] | string): networkError is string {
    return typeof networkError === 'string';
  }
}
