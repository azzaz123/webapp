export interface WalletBalanceHistoryApi {
  balance_history: {
    amount: number;
    bank_account: string;
    created_at: number;
    currency: 'EUR';
    estimated_pay_out_date: number | null;
    id: string;
    item: {
      bought: boolean;
      category_id: number;
      id: number;
      picture_url: string;
      price: { amount: number; currency: 'EUR' };
      publish_date: string;
      publish_status: 'BOUGHT' | unknown;
      reserved: boolean;
      title: string;
    } | null;
    type: 'TRANSFER_TO_BANK' | unknown;
    user: null;
  }[];
  next_page: null;
  wallet_balance_amount: number;
  wallet_balance_currency: 'EUR';
}
