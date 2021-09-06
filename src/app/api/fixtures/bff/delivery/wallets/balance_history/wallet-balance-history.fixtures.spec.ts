import { WalletBalanceHistoryApi } from '@api/bff/delivery/wallets/balance_history/dtos/responses';

export const MOCK_WALLET_BALANCE_HISTORY_API: WalletBalanceHistoryApi = {
  balance_history: [
    {
      amount: 3,
      bank_account: 'ES91XXXXXXXXXXXXXXXX1332',
      created_at: 1628087408983,
      currency: 'EUR',
      estimated_pay_out_date: null,
      id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
      item: null,
      type: 'TRANSFER_TO_BANK',
      user: null,
    },
    {
      amount: 3,
      bank_account: null,
      created_at: 1618903807478,
      currency: 'EUR',
      estimated_pay_out_date: null,
      id: 'a119e1c1-1410-484e-9870-c1b4a59572b3',
      item: {
        bought: true,
        category_id: 12800,
        id: 189278801,
        picture_url: 'http://cdn-beta.wallapop.com/images/10420/34/ow/__/c10420p189278801/i420098101.jpg?pictureSize=W800',
        price: { amount: 3, currency: 'EUR' },
        publish_date: '2021-04-19T10:42:47Z',
        publish_status: 'BOUGHT',
        reserved: true,
        title: 'Laia testing beta',
      },
      type: 'TRANSFER_IN',
      user: null,
    },
  ],
  next_page: null,
  wallet_balance_amount: 0,
  wallet_balance_currency: 'EUR',
};
