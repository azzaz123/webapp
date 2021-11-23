import { CurrencyCode } from '@api/core/model/currency.interface';

export interface TransactionTrackingDetailsPriceDto {
  amount: number;
  currency: CurrencyCode;
}
