import { mapUserVerifiedInfoStatusApiToUserVerifiedInfoStatus } from '@api/core/mappers/user-verifications/status';
import { UserVerifiedInfoStatus } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { EmailVerificationApi } from '../dtos/responses';

export const mapEmailVerificationApiToUserVerifiedInfoStatus: ToDomainMapper<EmailVerificationApi, UserVerifiedInfoStatus> = (
  input: EmailVerificationApi
): UserVerifiedInfoStatus => {
  const { emailVerifiedStatus } = input;

  return {
    status: mapUserVerifiedInfoStatusApiToUserVerifiedInfoStatus(emailVerifiedStatus),
  };
};
