export type APP_LOCALE = 'en' | 'es' | 'it';
export type SUBDOMAIN = 'uk' | 'es' | 'it';

export const SUBDOMAINS: Record<APP_LOCALE, SUBDOMAIN> = {
  en: 'uk',
  es: 'es',
  it: 'es',
};
