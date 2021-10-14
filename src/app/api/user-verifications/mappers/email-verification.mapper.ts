import { EmailVerification, EMAIL_VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { EmailVerificationApi, EMAIL_VERIFICATION_STATUS_API } from '../dtos';

export const mapEmailVerificationApiToEmailVerification: ToDomainMapper<EmailVerificationApi, EmailVerification> = (
  input: EmailVerificationApi
): EmailVerification => {
  const { emailVerifiedStatus } = input;

  const mapEmailVerificationStatusToDomain = {
    [EMAIL_VERIFICATION_STATUS_API.NOT_VERIFIED]: EMAIL_VERIFICATION_STATUS.NOT_VERIFIED,
    [EMAIL_VERIFICATION_STATUS_API.SENT]: EMAIL_VERIFICATION_STATUS.SENT,
    [EMAIL_VERIFICATION_STATUS_API.EXHAUSTED]: EMAIL_VERIFICATION_STATUS.EXHAUSTED,
    [EMAIL_VERIFICATION_STATUS_API.SMS_VERIFIED]: EMAIL_VERIFICATION_STATUS.SMS_VERIFIED,
  };

  return {
    status: mapEmailVerificationStatusToDomain[emailVerifiedStatus],
  };
};
