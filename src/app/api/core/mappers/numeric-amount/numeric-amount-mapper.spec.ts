import { MOCK_NUMBER_CURRENCY_CODE } from '@api/fixtures/core/money.fixtures';
import { MOCK_DEFAULT_NUMERIC_AMOUNT, MOCK_NUMERIC_AMOUNT } from '@api/fixtures/core/numeric-amount.fixtures';
import { mapNumberToNumericAmount } from './numeric-amount-mapper';

describe('GIVEN the mapNumberToNumericAmount', () => {
  describe('WHEN mapping a number', () => {
    it('should map to a numeric amount', () => {
      const expected = MOCK_NUMERIC_AMOUNT;
      const input: number = MOCK_NUMBER_CURRENCY_CODE.number;

      const result = mapNumberToNumericAmount(input);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
    it('should return the number as a string', () => {
      const expected: string = MOCK_NUMERIC_AMOUNT.toString();
      const input: number = MOCK_NUMBER_CURRENCY_CODE.number;

      const result = mapNumberToNumericAmount(input).toString();

      expect(result).toBe(expected);
    });
  });

  describe.each([
    [2.02, '2.02'],
    [2.2, '2.20'],
    [0.01, '0.01'],
    [0.9, '0.90'],
    [0.9, '0.90'],
    [13.13, '13.13'],
  ])('WHEN mapping a number', (input, output) => {
    it('should map to a numeric amount', () => {
      const result = mapNumberToNumericAmount(input).total.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

      expect(result).toBe(output);
    });
  });

  describe('WHEN mapping an invalid number', () => {
    it('should map to default numeric amount (0)', () => {
      const expected = MOCK_DEFAULT_NUMERIC_AMOUNT;
      const input: number = null;

      const result = mapNumberToNumericAmount(input);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });
});
