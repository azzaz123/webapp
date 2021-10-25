import { NumericAmount } from '@api/core/model/numeric-amount.interface';

export const MOCK_DEFAULT_NUMERIC_AMOUNT: NumericAmount = {
  integer: 0,
  decimals: 0,
  toString: () => '0',
  total: 0,
};
export const MOCK_NUMERIC_AMOUNT: NumericAmount = {
  integer: 13,
  decimals: 0,
  toString: () => '13',
  total: 13,
};
