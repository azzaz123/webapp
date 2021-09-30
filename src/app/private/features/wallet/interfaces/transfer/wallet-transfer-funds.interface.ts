import { CurrencyCode } from '@api/core/model/currency.interface';

export interface WalletTransferFundsInterface {
  amount: number;
  currency: CurrencyCode;
}
