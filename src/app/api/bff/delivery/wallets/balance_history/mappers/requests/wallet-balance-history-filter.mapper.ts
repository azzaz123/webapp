import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { InnerType, ToApiMapper } from '@api/core/utils/types';
import { WalletBalanceHistoryQueryParamsApi } from '../../dtos/requests/wallet-balance-history-filters-api.interface';

type WalletBalanceHistoryFilters = { page: number; type?: WALLET_HISTORY_FILTERS };
type WalletBalanceHistoryQueryParamTypeApi = InnerType<WalletBalanceHistoryQueryParamsApi, 'type'>;

export const mapWalletHistoryFiltersToApi: ToApiMapper<WalletBalanceHistoryFilters, WalletBalanceHistoryQueryParamsApi> = (
  input: WalletBalanceHistoryFilters
): WalletBalanceHistoryQueryParamsApi => {
  return {
    page: input.page.toString(),
    type: mapWalletHistoryTypeToApi[input.type],
  };
};

const mapWalletHistoryTypeToApi: Record<WALLET_HISTORY_FILTERS, WalletBalanceHistoryQueryParamTypeApi | null> = {
  [WALLET_HISTORY_FILTERS.ALL]: null,
  [WALLET_HISTORY_FILTERS.IN]: 'IN',
  [WALLET_HISTORY_FILTERS.OUT]: 'OUT',
};
