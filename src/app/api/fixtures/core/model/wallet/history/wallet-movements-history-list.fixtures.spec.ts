import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import {
  MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS,
  MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT_WITH_ESTIMATED_PAYOUT,
} from './movement-history-detail.fixtures.spec';

export const MOCK_WALLET_MOVEMENTS_HISTORY_LIST: WalletMovementsHistoryList = {
  list: MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS,
  paginationParameter: null,
  walletBalance: mapNumberAndCurrencyCodeToMoney({ number: 132, currency: 'EUR' }),
};

export const MOCK_WALLET_MOVEMENTS_HISTORY_LIST_FIRST_PAGE: WalletMovementsHistoryList = {
  ...MOCK_WALLET_MOVEMENTS_HISTORY_LIST,
  paginationParameter: 1,
};

export const MOCK_WALLET_MOVEMENTS_HISTORY_LIST_LAST_PAGE: WalletMovementsHistoryList = {
  ...MOCK_WALLET_MOVEMENTS_HISTORY_LIST,
  list: [MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT_WITH_ESTIMATED_PAYOUT],
  paginationParameter: null,
};

export const MOCK_WALLET_MOVEMENTS_HISTORY_LIST_EMPTY: WalletMovementsHistoryList = {
  list: [],
  walletBalance: mapNumberAndCurrencyCodeToMoney({ number: 0, currency: 'EUR' }),
};
