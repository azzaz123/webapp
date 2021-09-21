import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import { MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS } from './movement-history-detail.fixtures.spec';

export const MOCK_WALLET_MOVEMENTS_HISTORY_LIST: WalletMovementsHistoryList = {
  list: MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS,
  paginationParameter: null,
  walletBalance: mapNumberAndCurrencyCodeToMoney({ number: 132, currency: 'EUR' }),
};
