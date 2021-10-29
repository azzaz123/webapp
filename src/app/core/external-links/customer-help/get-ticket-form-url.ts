import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE, CUSTOMER_TICKET_FORM, CUSTOMER_HELP_BASE } from './customer-help-constants';

export function getTicketFormUrl(
  formId: CUSTOMER_TICKET_FORM,
  locale: APP_LOCALE,
  baseUrl: CUSTOMER_HELP_BASE = CUSTOMER_HELP_BASE.DEFAULT
): string {
  return `${baseUrl}${HELP_LOCALE[locale]}/requests/new?ticket_form_id=${formId}`;
}
