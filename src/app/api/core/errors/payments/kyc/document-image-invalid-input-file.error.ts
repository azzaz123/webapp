import { KYCErrorTranslations } from './kyc-error-translations';
import { KYCError } from './kyc.error';

export class DocumentImageIsInvalidInputFileError extends KYCError {
  constructor() {
    super(KYCErrorTranslations.DOCUMENT_IMAGE_INVALID_INPUT_FILE);
  }
}
