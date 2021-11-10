import { HttpParams } from '@angular/common/http';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { ToApiMapper } from '@api/core/utils/types';

type WalletBalanceHistoryFilters = { page: number; type?: WALLET_HISTORY_FILTERS };

export const mapWalletHistoryFiltersToApi: ToApiMapper<WalletBalanceHistoryFilters, HttpParams> = (
  input: WalletBalanceHistoryFilters
): HttpParams => {
  let params: HttpParams = new HttpParams().set('page', input.page.toString());
  const type = mapWalletHistoryTypeToApi[input.type];
  if (type) {
    params = params.set('type', type);
  }
  return params;
};

const mapWalletHistoryTypeToApi: Record<WALLET_HISTORY_FILTERS, string | null> = {
  [WALLET_HISTORY_FILTERS.ALL]: null,
  [WALLET_HISTORY_FILTERS.IN]: 'IN',
  [WALLET_HISTORY_FILTERS.OUT]: 'OUT',
};
