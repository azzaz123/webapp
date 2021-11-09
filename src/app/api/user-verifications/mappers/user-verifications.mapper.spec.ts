import {
  MOCK_USER_VERIFICATIONS_MAPPED,
  MOCK_USER_VERIFICATIONS_API_RESPONSE,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { mapUserVerificationsApiToUserVerifications } from './user-verifications.mapper';

describe('mapUserVerificationsApiToUserVerifications', () => {
  describe('when mapping from user verifications DTO into user verifications domain', () => {
    it('should map to user verifications domain', () => {
      const mappedVerifications = mapUserVerificationsApiToUserVerifications(MOCK_USER_VERIFICATIONS_API_RESPONSE);

      expect(JSON.stringify(mappedVerifications)).toEqual(JSON.stringify(MOCK_USER_VERIFICATIONS_MAPPED));
    });
  });
});
