export type PaymentsWalletsCurrencyApi = 'EUR';

export interface PaymentsWalletsApi {
  amount: number;
  currency: PaymentsWalletsCurrencyApi;
  id: string;
}
