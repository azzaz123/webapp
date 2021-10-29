import { mapVerificationStatusApiToVerificationStatus } from '@api/core/mappers/user-verifications/status';
import { Verification } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { EmailVerificationApi } from '../dtos/responses';

export const mapEmailVerificationApiToEmailVerification: ToDomainMapper<EmailVerificationApi, Verification> = (
  input: EmailVerificationApi
): Verification => {
  const { emailVerifiedStatus } = input;

  return {
    status: mapVerificationStatusApiToVerificationStatus(emailVerifiedStatus),
  };
};
