import { APP_LOCALE } from '@configs/subdomains.config';
import { CustomerTicketFormPages } from './customer-ticket-form-pages.type';

export type AllTicketFormPages = Record<APP_LOCALE, CustomerTicketFormPages>;
