import { UserVerifiedInfoStatus, USER_VERIFIED_INFO_STATUS } from '@api/core/model/verifications';
import { PhoneVerificationApi, USER_VERIFIED_INFO_STATUS_API } from '@api/user-verifications/dtos/responses';

export const MOCK_PHONE_VERIFICATION_API_RESPONSE: PhoneVerificationApi = {
  mobileVerifiedStatus: USER_VERIFIED_INFO_STATUS_API.SENT,
};

export const MOCK_PHONE_VERIFICATION_MAPPED: UserVerifiedInfoStatus = {
  status: USER_VERIFIED_INFO_STATUS.SENT,
};
