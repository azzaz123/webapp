import { CUSTOMER_HELP_SITE_BASE } from './enums/customer-help-site.enum';
import { EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID } from './enums/external-customer-ticket-form-page-id.enum';
import { getTicketFormUrl } from './get-ticket-form-url';
import { HELP_LOCALE } from './types/help-locale';

describe('getTicketFormUrl', () => {
  const ticketFormId = EXTERNAL_CUSTOMER_TICKET_FORM_PAGE_ID.KYC;
  const allHelpLocales: HELP_LOCALE[] = ['en-us', 'es-es', 'it'];
  const generateExpectedUrl = (lang: HELP_LOCALE, base: CUSTOMER_HELP_SITE_BASE = CUSTOMER_HELP_SITE_BASE.DEFAULT) => {
    return `${base}${lang}/requests/new?ticket_form_id=${ticketFormId}`;
  };

  describe.each(allHelpLocales)('when generating ticket form url', (helpLocale: HELP_LOCALE) => {
    it(`should return the expected url when language is ${helpLocale}`, () => {
      const url = getTicketFormUrl(ticketFormId, helpLocale);
      const expectedUrl = generateExpectedUrl(helpLocale);

      expect(url).toEqual(expectedUrl);
    });

    describe('and when specifying customer base URL', () => {
      it('should use specified customer base URL', () => {
        const base = CUSTOMER_HELP_SITE_BASE.ITALIAN;
        const url = getTicketFormUrl(ticketFormId, helpLocale, base);
        const expectedUrl = generateExpectedUrl(helpLocale, base);

        expect(url).toEqual(expectedUrl);
      });
    });
  });
});
