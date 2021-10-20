import { EmailVerification, EMAIL_VERIFICATION_STATUS } from '@api/core/model/verifications';
import { EmailVerificationApi, EMAIL_VERIFICATION_STATUS_API } from '@api/user-verifications/dtos';

export const MOCK_EMAIL_VERIFICATION_API_RESPONSE: EmailVerificationApi = {
  emailVerifiedStatus: EMAIL_VERIFICATION_STATUS_API.SENT,
};

export const MOCK_EMAIL_VERIFICATION_MAPPED: EmailVerification = {
  status: EMAIL_VERIFICATION_STATUS.SENT,
};
