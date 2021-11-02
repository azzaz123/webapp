import {
  MOCK_EMAIL_VERIFICATION_API_RESPONSE,
  MOCK_EMAIL_VERIFICATION_MAPPED,
} from '@api/fixtures/user-verifications/email-verification.fixtures.spec';
import { mapEmailVerificationApiToUserVerifiedInfoStatus } from './email-verification.mapper';

describe('mapEmailVerificationApiToUserVerifiedInfoStatus', () => {
  describe('when mapping from email verification DTO into email verification domain', () => {
    it('should map to email verification domain', () => {
      const mappedEmailVerification = mapEmailVerificationApiToUserVerifiedInfoStatus(MOCK_EMAIL_VERIFICATION_API_RESPONSE);

      expect(JSON.stringify(mappedEmailVerification)).toEqual(JSON.stringify(MOCK_EMAIL_VERIFICATION_MAPPED));
    });
  });
});
