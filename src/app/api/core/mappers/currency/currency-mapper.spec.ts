import { MOCK_CURRENCY_EURO, MOCK_CURRENCY_UNKNOWN, MOCK_UNKNOWN_CURRENCY_CODE } from '@api/fixtures/core/currency.fixtures';

import { mapCurrencyCodeToCurrency } from './currency-mapper';

describe('GIVEN the mapCurrencyCodeToCurrency', () => {
  describe('WHEN mapping currency code', () => {
    it('should map to the correct currency', () => {
      const expected = MOCK_CURRENCY_EURO;

      const result = mapCurrencyCodeToCurrency('EUR');

      expect(result).toEqual(expected);
    });
  });
  describe('WHEN mapping an unknown currency code', () => {
    it('should map to the unknown currency', () => {
      const expected = MOCK_CURRENCY_UNKNOWN;

      const result = mapCurrencyCodeToCurrency(MOCK_UNKNOWN_CURRENCY_CODE);

      expect(result).toEqual(expected);
    });
  });
  describe('WHEN mapping an unexisting currency', () => {
    it('should map to the default symbol currency', () => {
      const input = null;
      const expected = { code: input, symbol: '' };

      const result = mapCurrencyCodeToCurrency(input);

      expect(result).toEqual(expected);
    });
  });
});
