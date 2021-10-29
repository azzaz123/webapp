import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { APP_LOCALE } from '@configs/subdomains.config';
import { CUSTOMER_HELP_BASE, CUSTOMER_HELP_PAGE, CUSTOMER_TICKET_FORM, ITALIAN_CUSTOMER_HELP_PAGE } from './customer-help-constants';
import { getCustomerHelpUrl } from './get-customer-help-url';
import { getTicketFormUrl } from './get-ticket-form-url';

@Injectable({
  providedIn: 'root',
})
export class CustomerHelpService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE) {}

  public getPageUrl(
    articleId: CUSTOMER_HELP_PAGE | ITALIAN_CUSTOMER_HELP_PAGE,
    baseUrl: CUSTOMER_HELP_BASE = CUSTOMER_HELP_BASE.DEFAULT
  ): string {
    return getCustomerHelpUrl(articleId, this.locale, baseUrl);
  }

  public getFormPageUrl(formId: CUSTOMER_TICKET_FORM, baseUrl: CUSTOMER_HELP_BASE = CUSTOMER_HELP_BASE.DEFAULT): string {
    return getTicketFormUrl(formId, this.locale, baseUrl);
  }
}
