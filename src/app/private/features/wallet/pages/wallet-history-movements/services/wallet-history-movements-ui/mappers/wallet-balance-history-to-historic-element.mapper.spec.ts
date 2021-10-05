import { MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS } from '@api/fixtures/core/model/wallet/history/movement-history-detail.fixtures.spec';
import { MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapWalletBalanceHistoryDetailsToHistoricList } from './wallet-balance-history-to-historic-element.mapper';

describe('mapWalletBalanceHistoryDetailsToHistoricList', () => {
  describe('when converting wallet balance history details to historic list (web context)', () => {
    it('should map to historic list', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS;
      const totalBalance = MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS.totalBalance;

      result = mapWalletBalanceHistoryDetailsToHistoricList(MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS, totalBalance);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });
});
