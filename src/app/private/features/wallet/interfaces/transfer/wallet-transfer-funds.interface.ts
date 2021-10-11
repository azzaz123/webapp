import { CurrencyCode } from '@api/core/model/currency.interface';

export interface WalletTransferFunds {
  amount: number;
  currency: CurrencyCode;
}
