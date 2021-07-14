import {
  MOCK_PAYMENTS_WALLETS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLETS_RESPONSE,
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY,
  MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE,
} from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { mapPaymentsWalletsApiToMoney } from './payments-wallets.mapper';

describe('mapPaymentsWalletsApiToMoney', () => {
  describe('when mapping from wallet information DTO into money', () => {
    describe('and when ammount does not have decimals', () => {
      it('should map to money', () => {
        const mappedMoney = mapPaymentsWalletsApiToMoney(MOCK_PAYMENTS_WALLETS_RESPONSE);
        expect(mappedMoney).toEqual(MOCK_PAYMENTS_WALLETS_MAPPED_MONEY);
      });
    });

    describe('and when ammount has decimals', () => {
      it('should map to money', () => {
        const mappedMoney = mapPaymentsWalletsApiToMoney(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE);
        expect(mappedMoney).toEqual(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY);
      });
    });
  });
});
