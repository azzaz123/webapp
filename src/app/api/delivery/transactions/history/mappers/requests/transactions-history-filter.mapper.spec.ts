import { HttpParams } from '@angular/common/http';
import { mapTransactionsHistoryFiltersToApi } from './transactions-history-filter.mapper';

describe('mapTransactionsHistoryFiltersToApi', () => {
  describe('when converting transactions history filters from web context to server', () => {
    describe('and when asking for specific page', () => {
      it('should map to server context', () => {
        let result: HttpParams;
        const expectedResult = new HttpParams().appendAll({ page: '288' });

        result = mapTransactionsHistoryFiltersToApi({ page: 288 });

        expect(result).toEqual(expectedResult);
      });
    });
  });
});
