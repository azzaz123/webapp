import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { HistoricTransaction } from '@api/core/model';
import { TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS, TRANSACTION_STATUS } from '@api/core/model/delivery/transaction/status';
import { MOCK_TRANSACTION_ITEM_1, MOCK_TRANSACTION_ITEM_2 } from './transaction-item.fixtures.spec';
import { MOCK_TRANSACTION_USER_1, MOCK_TRANSACTION_USER_2 } from './transaction-user.fixtures.spec';

export const MOCK_HISTORIC_TRANSACTIONS: HistoricTransaction[] = [
  {
    id: '3b7560cc-b4f8-48bf-ba27-4d070952b3e8',
    creationDate: new Date('2021-10-22T10:57:14.000Z'),
    item: MOCK_TRANSACTION_ITEM_1,
    buyer: MOCK_TRANSACTION_USER_1,
    seller: MOCK_TRANSACTION_USER_2,
    moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 19.75, currency: 'EUR' }),
    status: {
      transaction: TRANSACTION_STATUS.SUCCEEDED,
      delivery: TRANSACTION_DELIVERY_STATUS.NONE,
      payment: TRANSACTION_PAYMENT_STATUS.NONE,
    },
    isCurrentUserTheSeller: true,
  },
  {
    id: '001cf831-d040-4e31-b4e7-aa50d2a3cadc',
    creationDate: new Date('2021-10-22T10:45:55.000Z'),
    item: MOCK_TRANSACTION_ITEM_2,
    buyer: MOCK_TRANSACTION_USER_1,
    seller: MOCK_TRANSACTION_USER_2,
    moneyAmount: mapNumberAndCurrencyCodeToMoney({ number: 12, currency: 'EUR' }),
    status: {
      transaction: TRANSACTION_STATUS.SUCCEEDED,
      delivery: TRANSACTION_DELIVERY_STATUS.NONE,
      payment: TRANSACTION_PAYMENT_STATUS.NONE,
    },
    isCurrentUserTheSeller: true,
  },
];
