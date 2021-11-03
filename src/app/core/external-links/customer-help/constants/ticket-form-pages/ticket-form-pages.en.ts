import { generateBaseTicketFormPagesByLocale } from '../../functions/generate-ticket-form-pages-by-locale';
import { CustomerTicketFormPages } from '../../types/customer-ticket-form-pages.type';
import { ENGLISH_HELP_LOCALE } from '../customer-help-locale';

export const englishCustomerTicketFormPages: CustomerTicketFormPages = generateBaseTicketFormPagesByLocale(ENGLISH_HELP_LOCALE);
