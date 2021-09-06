import { CUSTOMER_HELP_PAGE, HELP_LOCALE, HelpLocaleId } from './customer-help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';
type CUSTOMER_HELP_PAGE_ID = CUSTOMER_HELP_PAGE;

export function getCustomerHelpUrl(pageId: CUSTOMER_HELP_PAGE_ID, locale: HelpLocaleId): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/articles/${pageId}`;
}
