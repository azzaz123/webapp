import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { HistoricElement } from '../interfaces/historic-element.interface';

export const MOCK_HISTORIC_ELEMENT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'path/to/image/melenaalex.jpg',
  title: 'Melena Alejandro',
  description: 'Sale - 30 Sep',
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
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  iconUrl: 'assets/icons/money-in.svg',
  title: 'Muñeca reborn',
  description: 'Sale · 16 Sep',
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: 420, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: 'Withdrawal · 17 Sep',
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
};

export const MOCK_HISTORIC_ELEMENT_CASHOUT_WITH_ESTIMATED_PAYOUT: HistoricElement = {
  id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
  imageUrl: 'assets/images/bank.svg',
  iconUrl: 'assets/icons/money-out.svg',
  title: 'ES91••••1332',
  description: 'Withdrawal · 17 Sep',
  moneyAmmount: mapNumberAndCurrencyCodeToMoney({ number: -288, currency: 'EUR' }),
  subDescription: 'In your bank before 22 Sep',
};

export const MOCK_HISTORIC_ELEMENT_WITH_ID: HistoricElement = {
  ...MOCK_HISTORIC_ELEMENT,
  id: '1337',
};
