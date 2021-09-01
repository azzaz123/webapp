import { CUSTOMER_HELP_PAGE, HELP_LOCALE, HelpLocaleId, CUSTOMER_TICKET_FORM } from './customer-help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';
type CUSTOMER_HELP_PAGE_ID = CUSTOMER_HELP_PAGE;

export function getCustomerHelpUrl(pageId: CUSTOMER_HELP_PAGE_ID, locale: HelpLocaleId): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/articles/${pageId}`;
}

export function getTicketFormUrl(formId: CUSTOMER_TICKET_FORM, locale: HelpLocaleId): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/requests/new?ticket_form_id=${formId}`;
}
