import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CUSTOMER_HELP_BASE, CUSTOMER_HELP_PAGE, CUSTOMER_TICKET_FORM } from './customer-help-constants';
import { CustomerHelpService } from './customer-help.service';
import * as GetCustomerHelpUrl from './get-customer-help-url';
import * as GetTicketFormUrl from './get-ticket-form-url';

describe('CustomerHelpService', () => {
  let customerHelpService: CustomerHelpService;
  const pageId = CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING;
  const formId = CUSTOMER_TICKET_FORM.KYC;
  const MOCK_LOCALE_ID = 'es';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerHelpService,
        {
          provide: LOCALE_ID,
          useValue: MOCK_LOCALE_ID,
        },
      ],
    });

    customerHelpService = TestBed.inject(CustomerHelpService);
  });

  describe('when asking for page url', () => {
    it('should ask for the url', () => {
      spyOn(GetCustomerHelpUrl, 'getCustomerHelpUrl');

      customerHelpService.getPageUrl(pageId);

      expect(GetCustomerHelpUrl.getCustomerHelpUrl).toHaveBeenCalledWith(pageId, MOCK_LOCALE_ID, CUSTOMER_HELP_BASE.DEFAULT_SITE);
    });
  });

  describe('when asking for ticket form url', () => {
    it('should ask for the url', () => {
      spyOn(GetTicketFormUrl, 'getTicketFormUrl');

      customerHelpService.getFormPageUrl(formId);

      expect(GetTicketFormUrl.getTicketFormUrl).toHaveBeenCalledWith(formId, MOCK_LOCALE_ID, CUSTOMER_HELP_BASE.DEFAULT_SITE);
    });
  });
});
