export type CurrencyCode = 'EUR' | 'GBP' | 'USD' | 'wallacredits' | 'wallacoins';
export type CurrencySymbol = '€' | '£' | '$';

export const currencySymbolByCode: Record<CurrencyCode, CurrencySymbol> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  wallacredits: '€',
  wallacoins: '€',
};

export interface Currency {
  code: CurrencyCode;
  symbol: CurrencySymbol;
}
