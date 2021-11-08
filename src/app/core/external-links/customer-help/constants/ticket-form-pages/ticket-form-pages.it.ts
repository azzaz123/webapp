import { generateBaseTicketFormPagesByLocale } from '../../functions/generate-ticket-form-pages-by-locale';
import { CustomerTicketFormPages } from '../../types/customer-ticket-form-pages.type';
import { IT_HELP_LOCALE } from '../customer-help-locale';

export const itCustomerTicketFormPages: CustomerTicketFormPages = generateBaseTicketFormPagesByLocale(IT_HELP_LOCALE);
