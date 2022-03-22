import { APP_LOCALE } from '@configs/subdomains.config';

export enum CUSTOMER_HELP_SITE_BASE {
  DEFAULT = 'https://ayuda.wallapop.com/hc/',
  ITALIAN = 'https://assistenza.wallapop.com/hc/',
}

export const HELP_CENTER_URL_BY_LOCALE: Record<APP_LOCALE, string> = {
  en: 'https://ayuda.wallapop.com/hc/en',
  es: 'https://ayuda.wallapop.com/hc/es-es',
  it: 'https://assistenza.wallapop.com/hc/it',
};
