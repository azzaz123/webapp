import { generateBaseTicketFormPagesByLocale } from '../../functions/generate-ticket-form-pages-by-locale';
import { CustomerTicketFormPages } from '../../types/customer-ticket-form-pages.type';
import { ITALIAN_HELP_LOCALE } from '../customer-help-locale';

export const italianCustomerTicketFormPages: CustomerTicketFormPages = generateBaseTicketFormPagesByLocale(ITALIAN_HELP_LOCALE);
