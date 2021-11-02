import {
  MOCK_PHONE_VERIFICATION_API_RESPONSE,
  MOCK_PHONE_VERIFICATION_MAPPED,
} from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { mapPhoneVerificationApiToUserVerifiedInfoStatus } from './phone-verification.mapper';

describe('mapPhoneVerificationApiToUserVerifiedInfoStatus', () => {
  describe('when mapping from phone verification DTO into user phone verification domain', () => {
    it('should map to phone verification domain', () => {
      const mappedPhoneVerification = mapPhoneVerificationApiToUserVerifiedInfoStatus(MOCK_PHONE_VERIFICATION_API_RESPONSE);

      expect(JSON.stringify(mappedPhoneVerification)).toEqual(JSON.stringify(MOCK_PHONE_VERIFICATION_MAPPED));
    });
  });
});
