import { generateBaseTicketFormPagesByLocale } from '../../functions/generate-ticket-form-pages-by-locale';
import { CustomerTicketFormPages } from '../../types/customer-ticket-form-pages.type';
import { ES_HELP_LOCALE } from '../customer-help-locale';

export const esCustomerTicketFormPages: CustomerTicketFormPages = generateBaseTicketFormPagesByLocale(ES_HELP_LOCALE);
