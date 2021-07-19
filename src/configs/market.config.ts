import {APP_LOCALE} from './subdomains.config';
import {InjectionToken} from '@angular/core';

export type Market = 'ES' | 'IT'

const MARKET_MAP: Record<APP_LOCALE, Market> = {
  en: 'ES',
  es: 'ES',
  it: 'IT'
};


export const MARKET_PROVIDER: InjectionToken<Market> = new InjectionToken<Market>('MARKET_PROVIDER')

export function MarketSiteByLocale(locale: APP_LOCALE): Market {
  return MARKET_MAP[locale];
}
