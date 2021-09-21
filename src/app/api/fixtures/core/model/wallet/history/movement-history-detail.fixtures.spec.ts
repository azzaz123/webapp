import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';

export const MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_IN: WalletMovementHistoryDetail = {
  imageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  type: WALLET_HISTORY_MOVEMENT_TYPE.IN,
  title: 'crayones',
  description: 'Purchase · 16 Sep',
  date: new Date('2021-09-16T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 5.9, currency: 'EUR' }),
};

export const MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_OUT: WalletMovementHistoryDetail = {
  imageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  type: WALLET_HISTORY_MOVEMENT_TYPE.OUT,
  title: 'crayones',
  description: 'Purchase · 16 Sep',
  date: new Date('2021-09-16T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: -5.9, currency: 'EUR' }),
};

export const MOCK_MOVEMENT_HISTORY_DETAILS: WalletMovementHistoryDetail[] = [
  MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_IN,
  MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_IN,
  MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_OUT,
  MOCK_MOVEMENT_HISTORY_DETAIL_TYPE_IN,
];
