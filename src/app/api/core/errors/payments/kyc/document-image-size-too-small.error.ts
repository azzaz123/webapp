import { KYCErrorTranslations } from './kyc-error-translations';
import { KYCError } from './kyc.error';

export class DocumentImageSizeTooSmallError extends KYCError {
  constructor() {
    super(KYCErrorTranslations.DOCUMENT_IMAGE_SIZE_TOO_SMALL);
  }
}
