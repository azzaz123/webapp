import { CUSTOMER_HELP_SITE_BASE } from './enums/customer-help-site.enum';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from './enums/external-customer-ticket-form-page-id.enum';
import { HELP_LOCALE } from './types/help-locale';

export function getTicketFormUrl(
  formId: EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID,
  helpLocale: HELP_LOCALE,
  baseUrl: CUSTOMER_HELP_SITE_BASE = CUSTOMER_HELP_SITE_BASE.DEFAULT
): string {
  return `${baseUrl}${helpLocale}/requests/new?ticket_form_id=${formId}`;
}
