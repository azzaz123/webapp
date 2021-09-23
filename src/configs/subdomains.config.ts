export type APP_LOCALE = 'en' | 'es' | 'it';
export type SEO_WEB_SUBDOMAIN = 'uk' | 'es' | 'it' | 'fr' | 'www';
export type FUNCTIONAL_WEBAPP_SUBDOMAIN = 'uk' | 'es' | 'it' | 'fr' | 'web' | 'web-en' | 'web-it' | 'www';

export const SITE_URL_SUBDOMAINS: Record<FUNCTIONAL_WEBAPP_SUBDOMAIN, SEO_WEB_SUBDOMAIN> = {
  uk: 'uk',
  fr: 'fr',
  es: 'es',
  it: 'it',
  www: 'www',
  web: 'es',
  'web-en': 'uk',
  'web-it': 'it',
};
