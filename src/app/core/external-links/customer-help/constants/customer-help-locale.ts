import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE } from '../types/help-locale';

export const EN_HELP_LOCALE: HELP_LOCALE = 'en-us';
export const ES_HELP_LOCALE: HELP_LOCALE = 'es-es';
export const IT_HELP_LOCALE: HELP_LOCALE = 'it';

export const HELP_LOCALE_BY_APP_LOCALE: Record<APP_LOCALE, HELP_LOCALE> = {
  en: EN_HELP_LOCALE,
  es: ES_HELP_LOCALE,
  it: IT_HELP_LOCALE,
};
