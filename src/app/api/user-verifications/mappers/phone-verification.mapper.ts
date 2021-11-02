import { mapUserVerifiedInfoStatusApiToUserVerifiedInfoStatus } from '@api/core/mappers/user-verifications/status';
import { UserVerifiedInfoStatus } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { PhoneVerificationApi } from '../dtos/responses';

export const mapPhoneVerificationApiToUserVerifiedInfoStatus: ToDomainMapper<PhoneVerificationApi, UserVerifiedInfoStatus> = (
  input: PhoneVerificationApi
): UserVerifiedInfoStatus => {
  const { mobileVerifiedStatus } = input;

  return {
    status: mapUserVerifiedInfoStatusApiToUserVerifiedInfoStatus(mobileVerifiedStatus),
  };
};
