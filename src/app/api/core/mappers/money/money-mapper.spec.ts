import { MOCK_MONEY, MOCK_NUMBER_CURRENCY_CODE } from '@api/fixtures/core/money.fixtures';
import { mapNumberAndCurrencyCodeToMoney } from './money-mapper';

describe('GIVEN the mapCurrencyCodeToCurrency', () => {
  describe('WHEN mapping number currency code', () => {
    it('should map to the correct money', () => {
      const expected = MOCK_MONEY;

      const result = mapNumberAndCurrencyCodeToMoney(MOCK_NUMBER_CURRENCY_CODE);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
    it('should return the money as a string', () => {
      const expected: string = MOCK_MONEY.toString();
      const input = MOCK_NUMBER_CURRENCY_CODE;

      const result = mapNumberAndCurrencyCodeToMoney(input).toString();

      expect(result).toBe(expected);
    });
  });
});
