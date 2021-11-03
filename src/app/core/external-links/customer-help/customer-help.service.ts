import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { APP_LOCALE } from '@configs/subdomains.config';
import { allCustomerHelpPages } from './constants/help-pages/all-help-pages';
import { englishCustomerHelpPages } from './constants/help-pages/help-pages.en';
import { allTicketFormPages } from './constants/ticket-form-pages/all-ticket-form-pages';
import { englishCustomerTicketFormPages } from './constants/ticket-form-pages/ticket-form-pages.en';
import { CUSTOMER_HELP_PAGE, CUSTOMER_TICKET_FORM } from './customer-help-constants';
import { CustomerHelpPages } from './types/customer-help-pages.type';
import { CustomerTicketFormPages } from './types/customer-ticket-form-pages.type';

@Injectable({
  providedIn: 'root',
})
export class CustomerHelpService {
  private helpPages: CustomerHelpPages;
  private ticketFormPages: CustomerTicketFormPages;

  constructor(@Inject(LOCALE_ID) locale: APP_LOCALE) {
    this.helpPages = allCustomerHelpPages[locale] || englishCustomerHelpPages;
    this.ticketFormPages = allTicketFormPages[locale] || englishCustomerTicketFormPages;
  }

  public getPageUrl(helpPageId: CUSTOMER_HELP_PAGE): string {
    return this.helpPages[helpPageId];
  }

  public getFormPageUrl(ticketFormId: CUSTOMER_TICKET_FORM): string {
    return this.ticketFormPages[ticketFormId];
  }
}
