import { MOCK_BUMPS_PACKAGE_BALANCE, MOCK_BUMPS_PACKAGE_BALANCE_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import { mapBalance } from './bumps-mapper';

describe('Bump mapper', () => {
  describe('when mapping balance of bumps package', () => {
    it('should map to balance of bumps package domain', () => {
      const mappedBalance = mapBalance(MOCK_BUMPS_PACKAGE_BALANCE);
      expect(mappedBalance).toEqual(MOCK_BUMPS_PACKAGE_BALANCE_MAPPED);
    });
  });
});
