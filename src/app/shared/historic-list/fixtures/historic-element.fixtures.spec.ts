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
