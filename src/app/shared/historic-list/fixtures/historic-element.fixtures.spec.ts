import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { HistoricElement } from '../interfaces/historic-element.interface';

export const MOCK_HISTORIC_ELEMENT: HistoricElement = {
  itemImageUrl: 'path/to/image/melenaalex.jpg',
  title: 'Melena Alejandro',
  description: 'Sale - 30 Sep',
  date: new Date(1633011069974),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 12, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_WITH_ICON: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  iconUrl: 'path/to/icon/thumbsup.svg',
};

export const MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  subDescription: 'In your bank before 1 Oct',
};

export const MOCK_HISTORIC_ELEMENT_SALE: HistoricElement = {
  itemImageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  iconUrl: 'assets/icons/money-in.svg',
  title: 'Muñeca reborn',
  description: 'Sale · 16 Sep',
  date: new Date('2021-09-16T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 420, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT: HistoricElement = {
  itemImageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: 'Withdrawal · 17 Sep',
  date: new Date('2021-09-17T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT_WITH_ESTIMATED_PAYOUT: HistoricElement = {
  itemImageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: 'Withdrawal · 17 Sep',
  date: new Date('2021-09-17T11:04:20.177Z'),
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
  subDescription: 'In your bank before 22 Sep',
};

export const MOCK_HISTORIC_ELEMENT_WITH_ID: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '1337',
};
