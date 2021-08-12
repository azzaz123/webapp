import { KYCErrorTranslations } from './kyc-error-translations';
import { KYCError } from './kyc.error';

export class MangopayUserNotFoundError extends KYCError {
  constructor() {
    super(KYCErrorTranslations.MANGOPAY_USER_NOT_FOUND);
  }
}
