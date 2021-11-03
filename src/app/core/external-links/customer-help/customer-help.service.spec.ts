import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_LOCALE } from '@configs/subdomains.config';
import { allCustomerHelpPages } from './constants/help-pages/all-help-pages';
import { allTicketFormPages } from './constants/ticket-form-pages/all-ticket-form-pages';
import { CUSTOMER_HELP_PAGE, CUSTOMER_TICKET_FORM } from './customer-help-constants';
import { CustomerHelpService } from './customer-help.service';

describe('CustomerHelpService', () => {
  let service: CustomerHelpService;
  const pageId = CUSTOMER_HELP_PAGE.WALLET_HELP;
  const ticketFormId = CUSTOMER_TICKET_FORM.KYC;
  const allLanguages: APP_LOCALE[] = ['es', 'en', 'it'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe.each(allLanguages)('when asking for page url', (locale: APP_LOCALE) => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: locale });
      service = TestBed.inject(CustomerHelpService);
    });

    it(`should return the expected customer help page url for locale ${locale}`, () => {
      const url = service.getPageUrl(pageId);
      const expectedUrl = allCustomerHelpPages[locale][pageId];

      expect(url).toEqual(expectedUrl);
    });
  });

  describe.each(allLanguages)('when asking for ticket form page url', (locale: APP_LOCALE) => {
    beforeEach(() => {
      TestBed.overrideProvider(LOCALE_ID, { useValue: locale });
      service = TestBed.inject(CustomerHelpService);
    });

    it(`should return the expected customer ticket form url for locale ${locale}`, () => {
      const url = service.getFormPageUrl(ticketFormId);
      const expectedUrl = allTicketFormPages[locale][ticketFormId];

      expect(url).toEqual(expectedUrl);
    });
  });
});
