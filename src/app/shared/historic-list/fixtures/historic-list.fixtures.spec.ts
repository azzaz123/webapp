import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/core/model/delivery/pending-transactions-fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '../enums/historic-element-subdescription-type.enum';
import { HistoricList } from '../interfaces/historic-list.interface';
import {
  MOCK_HISTORIC_ELEMENT,
  MOCK_HISTORIC_ELEMENT_CASHOUT,
  MOCK_HISTORIC_ELEMENT_CASHOUT_WITH_ESTIMATED_PAYOUT,
  MOCK_HISTORIC_ELEMENT_SALE,
  MOCK_HISTORIC_ELEMENT_WITH_ICON_IN_DESCRIPTION,
} from './historic-element.fixtures.spec';

export const MOCK_HISTORIC_LIST: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'September',
          elements: [MOCK_HISTORIC_ELEMENT, MOCK_HISTORIC_ELEMENT, MOCK_HISTORIC_ELEMENT_WITH_ICON_IN_DESCRIPTION],
        },
      ],
    },
  ],
};

export const MOCK_HISTORIC_LIST_EMPTY: HistoricList = {
  elements: [],
};

export const MOCK_HISTORIC_LIST_WITHOUT_LABELS: HistoricList = {
  elements: [
    {
      elements: [
        {
          elements: [MOCK_HISTORIC_ELEMENT],
        },
      ],
    },
  ],
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
  totalBalance: mapNumberAndCurrencyCodeToMoney({ number: 132, currency: 'EUR' }),
};

export const MOCK_HISTORIC_LIST_FROM_WALLET_MOVEMENTS_WITH_ALL_ELEMENTS: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'September',
          elements: [MOCK_HISTORIC_ELEMENT_SALE, MOCK_HISTORIC_ELEMENT_CASHOUT, MOCK_HISTORIC_ELEMENT_CASHOUT_WITH_ESTIMATED_PAYOUT],
        },
      ],
    },
  ],
  totalBalance: mapNumberAndCurrencyCodeToMoney({ number: 132, currency: 'EUR' }),
};

export const MOCK_HISTORIC_LIST_FROM_PENDING_TRANSACTIONS: HistoricList = {
  elements: [
    {
      elements: [
        {
          elements: [
            {
              id: '81891bfa-9df3-41f9-9411-0cd85d1daf9e',
              imageUrl: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
              iconUrl: MOCK_PENDING_TRANSACTIONS[0].buyer.imageUrl,
              title: MOCK_PENDING_TRANSACTIONS[0].item.title,
              description: {
                text: 'Via shipping',
                iconUrl: 'TBD',
              },
              moneyAmount: MOCK_PENDING_TRANSACTIONS[0].moneyAmount,
              subDescription: { text: 'IN_TRANSIT', type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.VALID },
              payload: MOCK_PENDING_TRANSACTIONS[0],
            },
          ],
        },
      ],
    },
  ],
};

export const MOCK_HISTORIC_LIST_FROM_HISTORIC_TRANSACTIONS: HistoricList = {
  elements: [
    {
      label: '2021',
      elements: [
        {
          label: 'October',
          elements: [
            {
              id: '3b7560cc-b4f8-48bf-ba27-4d070952b3e8',
              imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
              iconUrl: MOCK_USER.image.urls_by_size.original,
              title: MOCK_ITEM.title,
              description: {
                text: 'Completed',
              },
              moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 19.75, currency: 'EUR' }),
            },
            {
              id: '001cf831-d040-4e31-b4e7-aa50d2a3cadc',
              imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
              iconUrl: MOCK_USER.image.urls_by_size.original,
              title: MOCK_ITEM.title,
              description: {
                text: 'Completed',
              },
              moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 12, currency: 'EUR' }),
            },
          ],
        },
      ],
    },
  ],
};
