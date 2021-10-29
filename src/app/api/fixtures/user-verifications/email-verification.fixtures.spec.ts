import { Verification, VERIFICATION_STATUS } from '@api/core/model/verifications';
import { EmailVerificationApi, VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';

export const MOCK_EMAIL_VERIFICATION_API_RESPONSE: EmailVerificationApi = {
  emailVerifiedStatus: VERIFICATION_STATUS_API.SENT,
};

export const MOCK_EMAIL_VERIFICATION_MAPPED: Verification = {
  status: VERIFICATION_STATUS.SENT,
};
