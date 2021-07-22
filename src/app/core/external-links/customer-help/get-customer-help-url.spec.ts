import { CUSTOMER_HELP_PAGE } from './customer-help-constants';
import { getCustomerHelpUrl } from './get-customer-help-url';

describe('CustomerHelpUrl', () => {
  describe('when asking for page url', () => {
    const pageId = CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING;
    const expected = (lang) => {
      return `https://ayuda.wallapop.com/hc/${lang}/articles/${pageId}`;
    };

    describe('and language is es', () => {
      const localeId = 'es';

      it('should return the expected url', () => {
        const url = getCustomerHelpUrl(pageId, localeId);

        expect(url).toEqual(expected('es-es'));
      });
    });

    describe('and language is en', () => {
      const localeId = 'en';

      it('should return the expected url', () => {
        const url = getCustomerHelpUrl(pageId, localeId);

        expect(url).toEqual(expected('en-us'));
      });
    });

    describe('and language is it', () => {
      const localeId = 'it';

      it('should return the expected url', () => {
        const url = getCustomerHelpUrl(pageId, localeId);

        expect(url).toEqual(expected('en-us'));
      });
    });
  });
});
