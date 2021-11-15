import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/model/delivery/pending-transactions-fixtures.spec';
import { MOCK_TRANSACTIONS_WITH_CREATION_DATE } from '@api/fixtures/core/model/delivery/transaction/transaction-with-creation-date.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapTransactionsWithCreationDateToHistoricList } from './transactions-with-creation-date-to-historic-list.mapper';

describe('mapTransactionsWithCreationDateToHistoricList', () => {
  describe('when converting transactions with creation date to web context', () => {
    it('should map to web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE;

      result = mapTransactionsWithCreationDateToHistoricList(MOCK_TRANSACTIONS_WITH_CREATION_DATE);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });

  describe('when converting empty transactions to web context', () => {
    it('should map to empty web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_EMPTY;

      result = mapTransactionsWithCreationDateToHistoricList([]);

      expect(result).toEqual(expectedResult);
    });
  });
});
