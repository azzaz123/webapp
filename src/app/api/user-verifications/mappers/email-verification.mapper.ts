import { EmailVerification, EMAIL_VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { EmailVerificationApi, EMAIL_VERIFICATION_STATUS_API } from '../dtos';

export const mapEmailVerificationApiToEmailVerification: ToDomainMapper<EmailVerificationApi, EmailVerification> = (
  input: EmailVerificationApi
): EmailVerification => {
  const { emailVerifiedStatus } = input;

  return {
    status: getEmailVerificationStatus(emailVerifiedStatus),
  };
};

const getEmailVerificationStatus = (emailVerifiedStatusApi: EMAIL_VERIFICATION_STATUS_API): EMAIL_VERIFICATION_STATUS => {
  const status = EMAIL_VERIFICATION_STATUS_API[emailVerifiedStatusApi];
  return EMAIL_VERIFICATION_STATUS[status as keyof EMAIL_VERIFICATION_STATUS];
};
