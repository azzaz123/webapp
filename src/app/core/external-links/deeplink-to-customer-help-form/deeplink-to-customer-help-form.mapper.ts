import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE_BY_APP_LOCALE } from '../customer-help/constants/customer-help-locale';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from '../customer-help/enums/external-customer-ticket-form-page-id.enum';
import { getTicketFormUrl } from '../customer-help/get-ticket-form-url';

export function mapDeeplinkToCustomerHelpForm(locale: APP_LOCALE, deeplink: string): string {
  const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[locale];
  const formId = deeplink.split('f=')[1] ?? null;
  let customerHelpFormPage: string = null;
  if (formId) {
    customerHelpFormPage = getTicketFormUrl(formId as unknown as EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID, HELP_LOCALE);
  }

  return customerHelpFormPage;
}
