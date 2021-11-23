import { mapVerificationStatusApiToVerificationStatus } from '@api/core/mappers/user-verifications/status';
import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { EmailVerificationApi } from '../dtos/responses';

export const mapEmailVerificationApiToVerificationStatus: ToDomainMapper<EmailVerificationApi, VERIFICATION_STATUS> = (
  emailVerification: EmailVerificationApi
): VERIFICATION_STATUS => {
  const { emailVerifiedStatus } = emailVerification;

  return mapVerificationStatusApiToVerificationStatus(emailVerifiedStatus);
};
