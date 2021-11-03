import { AllTicketFormPages } from '../../types/all-ticket-form-pages';
import { englishCustomerTicketFormPages } from './ticket-form-pages.en';
import { spanishCustomerTicketFormPages } from './ticket-form-pages.es';
import { italianCustomerTicketFormPages } from './ticket-form-pages.it';

export const allTicketFormPages: AllTicketFormPages = {
  en: englishCustomerTicketFormPages,
  es: spanishCustomerTicketFormPages,
  it: italianCustomerTicketFormPages,
};
