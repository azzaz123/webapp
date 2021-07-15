import { Currency } from './currency.interface';
import { NumericAmount } from './numeric-amount.interface';

export interface Money {
  amount: NumericAmount;
  currency: Currency;
}
