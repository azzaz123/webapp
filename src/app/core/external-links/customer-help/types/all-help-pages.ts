import { APP_LOCALE } from '@configs/subdomains.config';
import { CustomerHelpPages } from './customer-help-pages.type';

export type AllHelpPages = Record<APP_LOCALE, CustomerHelpPages>;
