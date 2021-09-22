import { MOCK_VERIFICATIONS_MAPPED, MOCK_VERIFICATIONS_RESPONSE } from '@api/fixtures/verifications/verifications.fixtures.spec';
import { mapVerificationsApiToVerifications } from './verifications.mapper';

describe('mapVerificationsApiToVerifications', () => {
  describe('when mapping from verifications DTO into verifications domain', () => {
    it('should map to verifications domain', () => {
      const mappedVerifications = mapVerificationsApiToVerifications(MOCK_VERIFICATIONS_RESPONSE);
      expect(JSON.stringify(mappedVerifications)).toEqual(JSON.stringify(MOCK_VERIFICATIONS_MAPPED));
    });
  });
});
