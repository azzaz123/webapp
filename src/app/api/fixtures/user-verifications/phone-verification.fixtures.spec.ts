import { PhoneVerificationApi, VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';

export const MOCK_PHONE_VERIFICATION_API_RESPONSE: PhoneVerificationApi = {
  mobileVerifiedStatus: VERIFICATION_STATUS_API.SENT,
};
