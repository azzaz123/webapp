import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { MOCK_EMAIL_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/email-verification.fixtures.spec';
import { mapEmailVerificationApiToVerificationStatus } from './email-verification.mapper';

describe('mapEmailVerificationApiToVerificationStatus', () => {
  describe('when mapping from email verification DTO into email verification domain', () => {
    it('should map to email verification domain', () => {
      const mappedEmailVerification = mapEmailVerificationApiToVerificationStatus(MOCK_EMAIL_VERIFICATION_API_RESPONSE);

      expect(mappedEmailVerification).toEqual(VERIFICATION_STATUS.SENT);
    });
  });
});
