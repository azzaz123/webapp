import { APP_LOCALE } from '@configs/subdomains.config';
import { CUSTOMER_HELP_BASE, CUSTOMER_TICKET_FORM, HELP_LOCALE } from './customer-help-constants';
import { getTicketFormUrl } from './get-ticket-form-url';

describe('getTicketFormUrl', () => {
  const formId = CUSTOMER_TICKET_FORM.KYC;
  const allLanguages: APP_LOCALE[] = ['es', 'en', 'it'];
  const expected = (lang: string, base: CUSTOMER_HELP_BASE = CUSTOMER_HELP_BASE.DEFAULT) => {
    return `${base}${lang}/requests/new?ticket_form_id=${formId}`;
  };

  describe.each(allLanguages)('when asking for ticket form url', (localeId: APP_LOCALE) => {
    it(`should return the expected url when language is ${localeId}`, () => {
      const url = getTicketFormUrl(formId, localeId);
      const expectedUrl = expected(HELP_LOCALE[localeId]);

      expect(url).toEqual(expectedUrl);
    });
  });

  describe('and when specifying customer base URL', () => {
    it('should use specified customer base URL', () => {
      const localeId: APP_LOCALE = 'en';
      const url = getTicketFormUrl(formId, localeId, CUSTOMER_HELP_BASE.ITALIAN_SITE);
      const expectedUrl = expected(HELP_LOCALE[localeId], CUSTOMER_HELP_BASE.ITALIAN_SITE);

      expect(url).toEqual(expectedUrl);
    });
  });
});
