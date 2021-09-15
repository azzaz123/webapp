import { HELP_LOCALE, HelpLocaleId, CUSTOMER_TICKET_FORM } from './customer-help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';

export function getTicketFormUrl(formId: CUSTOMER_TICKET_FORM, locale: HelpLocaleId): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/requests/new?ticket_form_id=${formId}`;
}
