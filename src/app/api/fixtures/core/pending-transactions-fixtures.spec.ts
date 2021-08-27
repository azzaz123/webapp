import { PendingTransaction } from '@api/core/model';

export const MOCK_PENDING_TRANSACTIONS: PendingTransaction[] = [
  {
    itemHash: 'kmzn9dmg4kjn',
    itemImageUrl: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
    itemTitle: 'Laia testing beta',
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
