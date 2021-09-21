import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { WalletBalanceHistoryQueryParamsApi } from '../../dtos/requests/wallet-balance-history-filters-api.interface';
import { mapWalletHistoryFiltersToApi } from './wallet-balance-history-filter.mapper';

describe('mapWalletHistoryFiltersToApi', () => {
  describe('when converting wallet history filters from web context to server', () => {
    describe('and when asking for specific page', () => {
      it('should map to server context', () => {
        let result: WalletBalanceHistoryQueryParamsApi;
        const expectedResult = { page: '288' };

        result = mapWalletHistoryFiltersToApi({ page: 288 });

        expect(result).toEqual(expectedResult);
      });
    });

    describe('and when asking for IN type', () => {
      it('should map to server context', () => {
        let result: WalletBalanceHistoryQueryParamsApi;
        const expectedResult = { page: '0', type: 'IN' };

        result = mapWalletHistoryFiltersToApi({ page: 0, type: WALLET_HISTORY_FILTERS.IN });

        expect(result).toEqual(expectedResult);
      });
    });

    describe('and when asking for OUT type', () => {
      it('should map to server context', () => {
        let result: WalletBalanceHistoryQueryParamsApi;
        const expectedResult = { page: '0', type: 'OUT' };

        result = mapWalletHistoryFiltersToApi({ page: 0, type: WALLET_HISTORY_FILTERS.OUT });

        expect(result).toEqual(expectedResult);
      });
    });
  });
});
