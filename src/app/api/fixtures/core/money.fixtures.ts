import { NumberCurrencyCode } from '@api/core/mappers/money/money-mapper';
import { Money } from '@api/core/model/money.interface';
import { MOCK_CURRENCY_EURO } from './currency.fixtures';

export const MOCK_NUMBER_CURRENCY_CODE: NumberCurrencyCode = {
  number: 13,
  currency: 'EUR',
};
export const MOCK_MONEY: Money = {
  amount: {
    integer: 13,
    decimals: 0,
    toString: () => '13',
    total: 13,
  },
  currency: MOCK_CURRENCY_EURO,
  toString: () => '13€',
};
