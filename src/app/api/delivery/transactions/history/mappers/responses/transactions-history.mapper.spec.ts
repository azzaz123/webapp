import { HistoricTransaction } from '@api/core/model';
import { MOCK_HISTORIC_TRANSACTIONS } from '@api/fixtures/core/model/delivery/transaction/historic-transaction.fixtures.spec';
import { MOCK_TRANSACTIONS_HISTORY_DTO } from '@api/fixtures/delivery/transactions/history/transactions-history.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_USER_PRO } from '@fixtures/user.fixtures.spec';
import { mapTransactionsHistoryToTransactions } from './transactions-history.mapper';

describe('mapTransactionsHistoryToTransactions', () => {
  describe('when converting users, items and completed transactions to web context', () => {
    it('should map to web context', () => {
      let result: HistoricTransaction[];
      const expectedResult = MOCK_HISTORIC_TRANSACTIONS;

      result = mapTransactionsHistoryToTransactions({
        currentUser: MOCK_USER_PRO,
        transactions: MOCK_TRANSACTIONS_HISTORY_DTO,
        users: [MOCK_USER, MOCK_USER_PRO],
        items: [MOCK_ITEM, MOCK_ITEM_FEATURED],
      });

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });
});
