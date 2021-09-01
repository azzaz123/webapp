import { CurrencyCode } from '../../model/currency.interface';
import { Money } from '../../model/money.interface';
import { ToDomainMapper } from '../../utils/types';
import { mapCurrencyCodeToCurrency } from '../currency/currency-mapper';
import { mapNumberToNumericAmount } from '../numeric-amount/numeric-amount-mapper';

export type NumberCurrencyCode = { number: number; currency: CurrencyCode };

export const mapNumberAndCurrencyCodeToMoney: ToDomainMapper<NumberCurrencyCode, Money> = (input: NumberCurrencyCode): Money => {
  const { number, currency } = input;
  const mappedAmount = mapNumberToNumericAmount(number);
  const mappedCurrency = mapCurrencyCodeToCurrency(currency);

  return {
    amount: mappedAmount,
    currency: mappedCurrency,
    toString: (showSign = false) => `${mappedAmount.toString(showSign)}${mappedCurrency.symbol}`,
  };
};
