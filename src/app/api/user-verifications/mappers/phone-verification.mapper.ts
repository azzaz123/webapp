import { mapVerificationStatusApiToVerificationStatus } from '@api/core/mappers/user-verifications/status';
import { Verification } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { PhoneVerificationApi } from '../dtos/responses';

export const mapPhoneVerificationApiToVerification: ToDomainMapper<PhoneVerificationApi, Verification> = (
  input: PhoneVerificationApi
): Verification => {
  const { mobileVerifiedStatus } = input;

  return {
    status: mapVerificationStatusApiToVerificationStatus(mobileVerifiedStatus),
  };
};
