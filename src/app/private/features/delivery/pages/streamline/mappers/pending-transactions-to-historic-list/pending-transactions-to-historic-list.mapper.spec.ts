import {
  MOCK_EMPTY_PENDING_TRANSACTIONS_AND_REQUESTS,
  MOCK_PENDING_TRANSACTIONS_AND_REQUESTS,
} from '@api/fixtures/core/model/delivery/pending-transactions-and-requests.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapPendingTransactionToHistoricList } from './pending-transactions-to-historic-list.mapper';

describe('mapPendingTransactionToHistoricList', () => {
  describe('when converting pending transactions to web context', () => {
    it('should map to web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS;

      result = mapPendingTransactionToHistoricList(MOCK_PENDING_TRANSACTIONS_AND_REQUESTS);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('when converting empty pending transactions to web context', () => {
    it('should map to empty web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_EMPTY;

      result = mapPendingTransactionToHistoricList(MOCK_EMPTY_PENDING_TRANSACTIONS_AND_REQUESTS);

      expect(result).toEqual(expectedResult);
    });
  });
});
