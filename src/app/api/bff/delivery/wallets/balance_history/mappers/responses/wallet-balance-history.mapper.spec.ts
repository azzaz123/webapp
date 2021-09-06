import { MOCK_WALLET_BALANCE_HISTORY_API } from '@api/fixtures/bff/delivery/wallets/balance_history/wallet-balance-history.fixtures.spec';
import { mapWalletBalanceHistoryApiToWalletMovements } from './wallet-balance-history.mapper';

describe('mapWalletBalanceHistoryApiToWalletMovements', () => {
  describe('when mapping from wallet balance history DTO to wallet historic movements', () => {
    it('should map to wallet historic movements', () => {
      const mappedMoney = mapWalletBalanceHistoryApiToWalletMovements(MOCK_WALLET_BALANCE_HISTORY_API);
      expect(JSON.stringify(mappedMoney)).toEqual(MOCK_WALLET_BALANCE_HISTORY_API);
    });
  });
});
