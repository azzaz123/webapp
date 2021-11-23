import { HttpParams } from '@angular/common/http';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { mapWalletHistoryFiltersToApi } from './wallet-balance-history-filter.mapper';

describe('mapWalletHistoryFiltersToApi', () => {
  const page: number = 288;

  describe('when converting wallet history filters from web context to server', () => {
    describe('and when asking for specific page', () => {
      it('should map to server context', () => {
        let result: HttpParams;
        const expectedParams = new HttpParams().set('page', page.toString());
        const expectedResult = expectedParams.toString();

        result = mapWalletHistoryFiltersToApi({ page });

        expect(result.toString()).toEqual(expectedResult);
      });
    });

    describe('and when asking for IN type', () => {
      it('should map to server context', () => {
        let result: HttpParams;
        const expectedParams = new HttpParams().set('page', page.toString()).set('type', 'IN');
        const expectedResult = expectedParams.toString();

        result = mapWalletHistoryFiltersToApi({ page, type: WALLET_HISTORY_FILTERS.IN });

        expect(result.toString()).toEqual(expectedResult);
      });
    });

    describe('and when asking for OUT type', () => {
      it('should map to server context', () => {
        let result: HttpParams;
        const expectedParams = new HttpParams().set('page', page.toString()).set('type', 'OUT');
        const expectedResult = expectedParams.toString();

        result = mapWalletHistoryFiltersToApi({ page, type: WALLET_HISTORY_FILTERS.OUT });

        expect(result.toString()).toEqual(expectedResult);
      });
    });
  });
});
