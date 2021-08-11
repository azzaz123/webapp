import { KYC_ERROR_CODES } from '@api/payments/kyc/mappers/errors/kyc-error-codes.enum';
import { KYCError } from './kyc.error';

export class DocumentImageIsInvalidInputFileError extends KYCError {
  constructor() {
    super(KYC_ERROR_CODES.KYC_DOCUMENT_IMAGE_INVALID_INPUT_FILE);
  }
}
