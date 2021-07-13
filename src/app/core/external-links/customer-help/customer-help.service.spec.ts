import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CUSTOMER_HELP_PAGE } from './customer-help-constants';
import { CustomerHelpService } from './customer-help.service';
import * as GetCustomerHelpUrl from './get-customer-help-url';

describe('CustomerHelpService', () => {
  let customerHelpService: CustomerHelpService;
  const localeId = 'es';
  const pageId = CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerHelpService,
        {
          provide: LOCALE_ID,
          useValue: localeId,
        },
      ],
    });

    customerHelpService = TestBed.inject(CustomerHelpService);
  });

  describe('when asking for page url', () => {
    it('should ask for the url', () => {
      spyOn(GetCustomerHelpUrl, 'getCustomerHelpUrl');

      customerHelpService.getPageUrl(pageId);

      expect(GetCustomerHelpUrl.getCustomerHelpUrl).toHaveBeenCalledWith(pageId, localeId);
    });
  });
});
