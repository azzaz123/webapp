import { Currency, CurrencyCode, CurrencySymbol } from '@api/core/model/currency.interface';

export const MOCK_CURRENCY_EURO: Currency = {
  code: 'EUR',
  symbol: '€',
};
export const MOCK_UNKNOWN_CURRENCY_CODE: CurrencyCode = 'unknownCurrency' as CurrencyCode;
export const MOCK_CURRENCY_UNKNOWN: Currency = {
  code: MOCK_UNKNOWN_CURRENCY_CODE,
  symbol: '' as CurrencySymbol,
};
