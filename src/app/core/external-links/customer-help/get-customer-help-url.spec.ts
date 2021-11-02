import { APP_LOCALE } from '@configs/subdomains.config';
import { CUSTOMER_HELP_BASE, CUSTOMER_HELP_PAGE, HELP_LOCALE } from './customer-help-constants';
import { getCustomerHelpUrl } from './get-customer-help-url';

describe('getCustomerHelpUrl', () => {
  const pageId = CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING;
  const allLanguages: APP_LOCALE[] = ['es', 'en', 'it'];
  const expected = (lang: string, base: CUSTOMER_HELP_BASE = CUSTOMER_HELP_BASE.DEFAULT_SITE) => {
    return `${base}${lang}/articles/${pageId}`;
  };

  describe.each(allLanguages)('when asking for ticket form url', (localeId: APP_LOCALE) => {
    it(`should return the expected url when language is ${localeId}`, () => {
      const url = getCustomerHelpUrl(pageId, localeId);
      const expectedUrl = expected(HELP_LOCALE[localeId]);

      expect(url).toEqual(expectedUrl);
    });
  });

  describe('and when specifying customer base URL', () => {
    it('should use specified customer base URL', () => {
      const localeId: APP_LOCALE = 'en';
      const url = getCustomerHelpUrl(pageId, localeId, CUSTOMER_HELP_BASE.ITALIAN_SITE);
      const expectedUrl = expected(HELP_LOCALE[localeId], CUSTOMER_HELP_BASE.ITALIAN_SITE);

      expect(url).toEqual(expectedUrl);
    });
  });
});
