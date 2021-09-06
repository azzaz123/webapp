import { CUSTOMER_TICKET_FORM } from './customer-help-constants';
import { getTicketFormUrl } from './get-ticket-form-url';

describe('TicketFormUrl', () => {
  describe('when asking for ticket form url', () => {
    const formId = CUSTOMER_TICKET_FORM.MANGOPAY_HELP;
    const expected = (lang: string) => {
      return `https://ayuda.wallapop.com/hc/${lang}/requests/new?ticket_form_id=${formId}`;
    };

    describe('and language is es', () => {
      const localeId = 'es';

      it('should return the expected url', () => {
        const url = getTicketFormUrl(formId, localeId);

        expect(url).toEqual(expected('es-es'));
      });
    });

    describe('and language is en', () => {
      const localeId = 'en';

      it('should return the expected url', () => {
        const url = getTicketFormUrl(formId, localeId);

        expect(url).toEqual(expected('en-us'));
      });
    });

    describe('and language is it', () => {
      const localeId = 'it';

      it('should return the expected url', () => {
        const url = getTicketFormUrl(formId, localeId);

        expect(url).toEqual(expected('en-us'));
      });
    });
  });
});
