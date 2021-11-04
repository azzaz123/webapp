import { CUSTOMER_HELP_SITE_BASE } from './enums/customer-help-site.enum';
import { EXTERNAL_CUSTOMER_HELP_PAGE_ID } from './enums/external-customer-help-page-id.enum';
import { getCustomerHelpUrl } from './get-customer-help-url';
import { HELP_LOCALE } from './types/help-locale';

describe('getCustomerHelpUrl', () => {
  const pageId = EXTERNAL_CUSTOMER_HELP_PAGE_ID.SHIPPING_SELL_WITH_SHIPPING;
  const allHelpLocales: HELP_LOCALE[] = ['en-us', 'es-es', 'it'];
  const generateExpectedUrl = (lang: HELP_LOCALE, base: CUSTOMER_HELP_SITE_BASE = CUSTOMER_HELP_SITE_BASE.DEFAULT) => {
    return `${base}${lang}/articles/${pageId}`;
  };

  describe.each(allHelpLocales)('when generating customer help page url', (helpLocale: HELP_LOCALE) => {
    it(`should return the expected url when language is ${helpLocale}`, () => {
      const url = getCustomerHelpUrl(pageId, helpLocale);
      const expectedUrl = generateExpectedUrl(helpLocale);

      expect(url).toEqual(expectedUrl);
    });

    describe('and when specifying customer site', () => {
      it('should use specified customer site', () => {
        const base = CUSTOMER_HELP_SITE_BASE.ITALIAN;
        const url = getCustomerHelpUrl(pageId, helpLocale, base);
        const expectedUrl = generateExpectedUrl(helpLocale, base);

        expect(url).toEqual(expectedUrl);
      });
    });
  });
});
