import { CUSTOMER_TICKET_FORM } from '../customer-help-constants';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from '../enums/external-customer-ticket-form-page-id.enum';
import { getTicketFormUrl } from '../get-ticket-form-url';
import { CustomerTicketFormPages } from '../types/customer-ticket-form-pages.type';
import { HELP_LOCALE } from '../types/help-locale';

export function generateBaseTicketFormPagesByLocale(locale: HELP_LOCALE): CustomerTicketFormPages {
  return {
    [CUSTOMER_TICKET_FORM.KYC]: getTicketFormUrl(EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID.KYC, locale),
  };
}
