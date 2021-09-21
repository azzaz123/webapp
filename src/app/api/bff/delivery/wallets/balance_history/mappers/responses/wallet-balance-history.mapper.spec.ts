import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import { MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API } from '@api/fixtures/bff/delivery/wallets/balance_history/wallet-balance-history.fixtures.spec';
import { MOCK_WALLET_MOVEMENTS_HISTORY_LIST } from '@api/fixtures/core/model/wallet/history/wallet-movements-history-list.fixtures.spec';
import { mapWalletBalanceHistoryApiToWalletMovements } from './wallet-balance-history.mapper';

describe('mapWalletBalanceHistoryApiToWalletMovements', () => {
  describe('when converting wallet balance history info from server to web context', () => {
    it('should map to web context', () => {
      let result: WalletMovementsHistoryList;
      const expectedResult = MOCK_WALLET_MOVEMENTS_HISTORY_LIST;

      result = mapWalletBalanceHistoryApiToWalletMovements(MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });
});
