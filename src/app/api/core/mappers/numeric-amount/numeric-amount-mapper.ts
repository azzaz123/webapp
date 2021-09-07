import { NumericAmount } from '../../model/numeric-amount.interface';
import { ToDomainMapper } from '../../utils/types';

export const mapNumberToNumericAmount: ToDomainMapper<number, NumericAmount> = (input: number): NumericAmount => {
  return {
    integer: getIntegerPartFromNumber(input),
    decimals: getDecimalPartFromNumber(input),
    total: input ?? 0,
    toString: (showSign?: boolean) => `${getPositiveSign(input, showSign)}${input.toLocaleString()}`,
  };
};

type numericSign = '+' | '';

function getIntegerPartFromNumber(number: number): number {
  let result = 0;
  try {
    result = Math.trunc(number);
  } catch {}

  return result;
}

function getDecimalPartFromNumber(number: number): number {
  const numberOfParsedDecimals = 2;
  let result = 0;

  try {
    const rawDecimals = number % 1;
    if (rawDecimals === 0) {
      return result;
    }

    const stringDecimals = rawDecimals.toString();
    const startDecimalPosition = 2;
    const truncatedDecimals = stringDecimals.substring(startDecimalPosition, startDecimalPosition + numberOfParsedDecimals);
    const parsedDecimals = parseInt(truncatedDecimals);
    result = parsedDecimals;
  } catch {}

  return result;
}

function getPositiveSign(amount: number, showSign?: boolean): numericSign {
  return showSign && amount >= 0 ? '+' : '';
}
