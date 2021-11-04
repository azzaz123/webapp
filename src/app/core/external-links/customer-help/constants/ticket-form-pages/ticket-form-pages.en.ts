import { generateBaseTicketFormPagesByLocale } from '../../functions/generate-ticket-form-pages-by-locale';
import { CustomerTicketFormPages } from '../../types/customer-ticket-form-pages.type';
import { EN_HELP_LOCALE } from '../customer-help-locale';

export const enCustomerTicketFormPages: CustomerTicketFormPages = generateBaseTicketFormPagesByLocale(EN_HELP_LOCALE);
