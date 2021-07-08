import { CUSTOMER_HELP_ARTICLE, HELP_LOCALE } from './customer-help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';
type CUSTOMER_HELP_ARTICLE_ID = CUSTOMER_HELP_ARTICLE;

export function getCustomerHelpUrl(article: CUSTOMER_HELP_ARTICLE_ID, locale: HELP_LOCALE): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/articles/${article}`;
}
