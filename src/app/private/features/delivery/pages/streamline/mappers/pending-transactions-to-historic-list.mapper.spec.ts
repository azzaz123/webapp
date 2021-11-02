import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/pending-transactions-fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapPendingTransactionToHistoricList } from './pending-transactions-to-historic-list.mapper';

describe('mapPendingTransactionToHistoricList', () => {
  describe('when converting pending transactions to web context', () => {
    it('should map to web context', () => {
      let result: HistoricList;
      const expectedResult = { elements: [] };

      result = mapPendingTransactionToHistoricList(MOCK_PENDING_TRANSACTIONS);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });
});
