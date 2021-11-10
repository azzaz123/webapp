import { mapVerificationStatusApiToVerificationStatus } from '@api/core/mappers/user-verifications/status';
import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { PhoneVerificationApi } from '../dtos/responses';

export const mapPhoneVerificationApiToVerificationStatus: ToDomainMapper<PhoneVerificationApi, VERIFICATION_STATUS> = (
  phoneVerification: PhoneVerificationApi
): VERIFICATION_STATUS => {
  const { mobileVerifiedStatus } = phoneVerification;

  return mapVerificationStatusApiToVerificationStatus(mobileVerifiedStatus);
};
