export type CurrencyCode = 'EUR';
export type CurrencySymbol = '€';

export const currencySymbolByCode: Record<CurrencyCode, CurrencySymbol> = {
  EUR: '€',
};

export interface Currency {
  code: CurrencyCode;
  symbol: CurrencySymbol;
}
