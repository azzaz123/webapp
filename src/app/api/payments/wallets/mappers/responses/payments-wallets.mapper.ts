import { CurrencyCode, CurrencySymbol, currencySymbolByCode } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { PaymentsWalletsApi } from '../../dtos/responses/payments-wallets-api.interface';

export const mapPaymentsWalletsApiToMoney: ToDomainMapper<PaymentsWalletsApi, Money> = (input: PaymentsWalletsApi): Money => {
  const { amount, currency: currencyCode } = input;

  return {
    amount: {
      integer: getIntegerPartFromNumber(amount),
      decimals: getDecimalPartFromNumber(amount),
      total: amount,
    },
    currency: {
      code: currencyCode,
      symbol: getSymbolFromCurrencyCode(currencyCode),
    },
  };
};

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

function getSymbolFromCurrencyCode(currencyCode: CurrencyCode): CurrencySymbol {
  return currencySymbolByCode[currencyCode];
}
