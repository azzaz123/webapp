import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';

export const MOCK_MOVEMENT_HISTORY_DETAIL_SALE: WalletMovementHistoryDetail = {
  imageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  type: WALLET_HISTORY_MOVEMENT_TYPE.IN,
  title: 'Muñeca reborn',
  description: 'Sale · 16 Sep',
  date: new Date('2021-09-16T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 420, currency: 'EUR' }),
};

export const MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT: WalletMovementHistoryDetail = {
  imageUrl: 'assets/images/bank.svg',
  type: WALLET_HISTORY_MOVEMENT_TYPE.OUT,
  title: 'ES91••••1332',
  description: 'Withdrawal · 16 Sep',
  date: new Date('2021-09-17T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 288, currency: 'EUR' }),
};

export const MOCK_DEFAULT_MOVEMENT_HISTORY_DETAILS: WalletMovementHistoryDetail[] = [
  MOCK_MOVEMENT_HISTORY_DETAIL_SALE,
  MOCK_MOVEMENT_HISTORY_DETAIL_CASHOUT,
];
