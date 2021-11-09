import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { MOCK_PHONE_VERIFICATION_API_RESPONSE } from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { mapPhoneVerificationApiToVerificationStatus } from './phone-verification.mapper';

describe('mapPhoneVerificationApiToVerificationStatus', () => {
  describe('when mapping from phone verification DTO into user phone verification domain', () => {
    it('should map to phone verification domain', () => {
      const mappedPhoneVerification = mapPhoneVerificationApiToVerificationStatus(MOCK_PHONE_VERIFICATION_API_RESPONSE);

      expect(mappedPhoneVerification).toEqual(VERIFICATION_STATUS.SENT);
    });
  });
});
