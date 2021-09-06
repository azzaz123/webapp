import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CUSTOMER_HELP_PAGE, CUSTOMER_TICKET_FORM, HelpLocaleId } from './customer-help-constants';
import { getCustomerHelpUrl } from './get-customer-help-url';
import { getTicketFormUrl } from './get-ticket-form-url';

@Injectable({
  providedIn: 'root',
})
export class CustomerHelpService {
  constructor(@Inject(LOCALE_ID) private locale: HelpLocaleId) {}

  public getPageUrl(articleId: CUSTOMER_HELP_PAGE): string {
    return getCustomerHelpUrl(articleId, this.locale);
  }

  public getFormPageUrl(formId: CUSTOMER_TICKET_FORM): string {
    return getTicketFormUrl(formId, this.locale);
  }
}
