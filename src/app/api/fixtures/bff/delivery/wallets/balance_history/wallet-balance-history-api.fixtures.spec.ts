import { WalletBalanceHistoryApi } from '@api/bff/delivery/wallets/balance_history/dtos/responses';

export const MOCK_DEFAULT_WALLET_BALANCE_HISTORY_API: WalletBalanceHistoryApi = {
  balance_history: [
    {
      amount: 420,
      bank_account: null,
      created_at: 1631790260177,
      currency: 'EUR',
      estimated_pay_out_date: null,
      id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
      item: {
        bought: true,
        category_id: 12800,
        id: 189278801,
        picture_url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
        price: { amount: 420, currency: 'EUR' },
        publish_date: '2021-04-19T10:42:47Z',
        publish_status: 'BOUGHT',
        reserved: true,
        title: 'Muñeca reborn',
      },
      type: 'TRANSFER_IN',
      user: null,
    },
    {
      amount: 288,
      bank_account: 'ES91XXXXXXXXXXXXXXXX1332',
      created_at: 1631876660177,
      currency: 'EUR',
      estimated_pay_out_date: null,
      id: '7cd4ef9a-6fb9-427d-a26c-7a3b742be019',
      item: null,
      type: 'TRANSFER_TO_BANK',
      user: null,
    },
  ],
  next_page: null,
  wallet_balance_amount: 132,
  wallet_balance_currency: 'EUR',
};
