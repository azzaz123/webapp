import { NumberCurrencyCode } from '@api/core/mappers/money/money-mapper';
import { Money } from '@api/core/model/money.interface';
import { MOCK_CURRENCY_EURO } from './currency.fixtures';
import { MOCK_NUMERIC_AMOUNT } from './numeric-amount.fixtures';

export const MOCK_NUMBER_CURRENCY_CODE: NumberCurrencyCode = {
  number: 13,
  currency: 'EUR',
};
export const MOCK_MONEY: Money = {
  amount: MOCK_NUMERIC_AMOUNT,
  currency: MOCK_CURRENCY_EURO,
  toString: () => '13€',
};
