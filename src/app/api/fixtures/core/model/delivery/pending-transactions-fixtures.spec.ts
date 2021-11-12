import { PendingTransaction } from '@api/core/model';
import { TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS, TRANSACTION_STATUS } from '@api/core/model/delivery/transaction/status';

export const MOCK_PENDING_TRANSACTIONS: PendingTransaction[] = [
  {
    id: '81891bfa-9df3-41f9-9411-0cd85d1daf9e',
    item: {
      id: 'kmzn9dmg4kjn',
      imageUrl: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
      title: 'Laia testing beta',
    },
    buyer: {
      id: 'mxzo7qgdvlj9',
      imageUrl: 'http://cdn-beta.wallapop.com/images/13/19/ok/__/c13p76729033/i420346101.jpg?pictureSize=W800',
      name: 'Generisius M.',
    },
    seller: {
      id: 'npj9v2o98m6e',
      imageUrl: 'http://cdn-beta.wallapop.com/images/13/1a/7c/__/c13p77605037/i419166102.jpg?pictureSize=W800',
      name: 'Dimasiado P.',
    },
    status: {
      transaction: TRANSACTION_STATUS.PENDING,
      delivery: TRANSACTION_DELIVERY_STATUS.IN_TRANSIT,
      payment: TRANSACTION_PAYMENT_STATUS.PAY_IN_SUCCEEDED,
    },
    moneyAmount: {
      amount: {
        integer: 3,
        decimals: 0,
        toString: () => '',
        total: 3,
      },
      currency: {
        code: 'EUR',
        symbol: '€',
      },
      toString: () => '',
    },
  },
];
