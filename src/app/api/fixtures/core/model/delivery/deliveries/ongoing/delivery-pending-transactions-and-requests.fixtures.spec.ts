import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';

export const MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_BUYER: DeliveryPendingTransactionsAndRequests = {
  requests: [
    {
      id: '823827329873',
      item: { id: '23827837283', imageUrl: '/path/to/icon/thumbsup.svg', title: 'Melena Alejandro' },
      buyer: { id: '232323', imageUrl: 'img/perfilLaia.png', name: 'Laia' },
      seller: { id: '987459347', imageUrl: 'img/perfilToni.png', name: 'Toni' },
      moneyAmount: { amount: { integer: 66666666, decimals: 0, total: 66666666 }, currency: { code: 'EUR', symbol: '€' } },
      isCurrentUserTheSeller: false,
    },
  ],
  transactions: [
    {
      id: '8767665655',
      item: { id: '55454545', imageUrl: '/path/to/icon/thumbsup.svg', title: 'Barba Lluís' },
      buyer: { id: '232323', imageUrl: 'img/perfilCarlos.png', name: 'Carlos' },
      seller: { id: '09787864311', imageUrl: 'img/perfilGonzalo.png', name: 'Gonzalo' },
      status: { name: 6, translation: 'Reviewing the issue...' },
      state: 6,
      moneyAmount: { amount: { integer: 66666666, decimals: 0, total: 66666666 }, currency: { code: 'EUR', symbol: '€' } },
      isCurrentUserTheSeller: false,
    },
  ],
};

export const MOCK_DELIVERY_PENDING_TRANSACTIONS_AND_REQUESTS_AS_SELLER: DeliveryPendingTransactionsAndRequests = {
  requests: [],
  transactions: [
    {
      id: '22222',
      item: { id: '777', imageUrl: '/path/to/icon/thumbsup.svg', title: 'Barba Lluís' },
      buyer: { id: '4444444', imageUrl: 'img/perfilLaia.png', name: 'Laia' },
      seller: { id: '666', imageUrl: 'img/perfilGonzalo.png', name: 'Gonzalo' },
      status: { name: 12, translation: 'Shipment not completed' },
      state: 10,
      moneyAmount: { amount: { integer: 2221, decimals: 0, total: 2221 }, currency: { code: 'EUR', symbol: '€' } },
      isCurrentUserTheSeller: true,
    },
  ],
};
