import { CUSTOMER_HELP_PAGE, HELP_LOCALE } from './customer-help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';
type CUSTOMER_HELP_PAGE_ID = CUSTOMER_HELP_PAGE;

export function getCustomerHelpUrl(article: CUSTOMER_HELP_PAGE_ID, locale: HELP_LOCALE): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/articles/${article}`;
}
