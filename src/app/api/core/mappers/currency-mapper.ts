import { CurrencyCode, Currency, CurrencySymbol, currencySymbolByCode } from '../model/currency.interface';
import { ToDomainMapper } from '../utils/types';

export const mapCurrencyCodeToCurrency: ToDomainMapper<CurrencyCode, Currency> = (input: CurrencyCode): Currency => {
  return {
    code: input,
    symbol: getSymbolFromCurrencyCode(input),
  };
};

function getSymbolFromCurrencyCode(currencyCode: CurrencyCode): CurrencySymbol {
  return currencySymbolByCode[currencyCode];
}
