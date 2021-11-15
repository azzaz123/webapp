import { MOCK_HISTORIC_TRANSACTIONS } from '@api/fixtures/core/model/delivery/transaction/historic-transaction.fixtures.spec';
import {
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapHistoricTransactionsToHistoricList } from './historic-transactions-to-historic-list.mapper';

describe('mapTransactionsWithCreationDateToHistoricList', () => {
  describe('when converting historic transactions date to UI web context', () => {
    it('should map to web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_FROM_TRANSACTIONS_WITH_CREATION_DATE;

      result = mapHistoricTransactionsToHistoricList(MOCK_HISTORIC_TRANSACTIONS);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });

  describe('when converting empty transactions to UI web context', () => {
    it('should map to empty web context', () => {
      let result: HistoricList;
      const expectedResult = MOCK_HISTORIC_LIST_EMPTY;

      result = mapHistoricTransactionsToHistoricList([]);

      expect(result).toEqual(expectedResult);
    });
  });
});
