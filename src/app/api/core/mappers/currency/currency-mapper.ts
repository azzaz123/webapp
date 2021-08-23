import { CurrencyCode, Currency, CurrencySymbol, currencySymbolByCode } from '../../model/currency.interface';
import { ToDomainMapper } from '../../utils/types';

export const mapCurrencyCodeToCurrency: ToDomainMapper<CurrencyCode, Currency> = (input: CurrencyCode | unknown): Currency => {
  return {
    code: input as CurrencyCode,
    symbol: getSymbolFromCurrencyCode(input as CurrencyCode),
  };
};

function getSymbolFromCurrencyCode(currencyCode: CurrencyCode): CurrencySymbol {
  return currencySymbolByCode[currencyCode] ?? ('' as CurrencySymbol);
}
