import { Verification, VERIFICATION_STATUS } from '@api/core/model/verifications';
import { VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';
import { PhoneVerificationApi } from '@api/user-verifications/dtos/responses/phone-verification-api.interface';

export const MOCK_PHONE_VERIFICATION_API_RESPONSE: PhoneVerificationApi = {
  mobileVerifiedStatus: VERIFICATION_STATUS_API.SENT,
};

export const MOCK_PHONE_VERIFICATION_MAPPED: Verification = {
  status: VERIFICATION_STATUS.SENT,
};
