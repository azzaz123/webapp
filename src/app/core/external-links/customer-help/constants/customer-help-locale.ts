import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE } from '../types/help-locale';

export const ENGLISH_HELP_LOCALE: HELP_LOCALE = 'en-us';
export const SPANISH_HELP_LOCALE: HELP_LOCALE = 'es-es';
export const ITALIAN_HELP_LOCALE: HELP_LOCALE = 'it';

export const HELP_LOCALE_BY_APP_LOCALE: Record<APP_LOCALE, HELP_LOCALE> = {
  en: ENGLISH_HELP_LOCALE,
  es: SPANISH_HELP_LOCALE,
  it: ITALIAN_HELP_LOCALE,
};
