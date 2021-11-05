import { EmailVerificationApi, VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';

export const MOCK_EMAIL_VERIFICATION_API_RESPONSE: EmailVerificationApi = {
  emailVerifiedStatus: VERIFICATION_STATUS_API.SENT,
};
