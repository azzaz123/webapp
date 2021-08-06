import { CurrencyCode } from '../../model/currency.interface';
import { Money } from '../../model/money.interface';
import { ToDomainMapper } from '../../utils/types';
import { mapCurrencyCodeToCurrency } from '../currency/currency-mapper';
import { mapNumberToNumericAmount } from '../numeric-amount/numeric-amount-mapper';

type InputToMoney = { number: number; currency: CurrencyCode };

export const mapNumberAndCurrencyCodeToMoney: ToDomainMapper<InputToMoney, Money> = (input: InputToMoney): Money => {
  const { number, currency } = input;

  return {
    amount: mapNumberToNumericAmount(number),
    currency: mapCurrencyCodeToCurrency(currency),
  };
};
