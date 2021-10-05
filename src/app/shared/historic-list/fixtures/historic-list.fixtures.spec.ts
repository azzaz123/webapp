import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { HistoricList } from '../interfaces/historic-list.interface';
import {
  MOCK_HISTORIC_ELEMENT,
  MOCK_HISTORIC_ELEMENT_CASHOUT,
  MOCK_HISTORIC_ELEMENT_SALE,
  MOCK_HISTORIC_ELEMENT_WITH_ICON,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION,
} from './historic-element.fixtures.spec';

export const MOCK_HISTORIC_LIST: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'September',
          elements: [MOCK_HISTORIC_ELEMENT, MOCK_HISTORIC_ELEMENT_WITH_ICON, MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION],
        },
      ],
    },
  ],
};

export const MOCK_HISTORIC_LIST_EMPTY: HistoricList = {
  elements: [],
};

export const MOCK_HISTORIC_LIST_WITH_BALANCE: HistoricList = {
  ...MOCK_HISTORIC_LIST,
  totalBalance: mapNumberAndCurrencyCodeToMoney({ number: 123, currency: 'EUR' }),
};

export const MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'September',
          elements: [MOCK_HISTORIC_ELEMENT_SALE, MOCK_HISTORIC_ELEMENT_CASHOUT],
        },
      ],
    },
  ],
  totalBalance: mapNumberAndCurrencyCodeToMoney({ number: 420, currency: 'EUR' }),
};
