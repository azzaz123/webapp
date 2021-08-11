import { KYC_VERIFICATION_ERROR_CODES } from '@api/payments/kyc/mappers/errors/kyc-verification-error-codes.enum';
import { KYCError } from './kyc.error';

export class MangopayUserNotFoundError extends KYCError {
  constructor() {
    super(KYC_VERIFICATION_ERROR_CODES.MANGOPAY_USER_NOT_FOUND);
  }
}
