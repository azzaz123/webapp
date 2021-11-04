import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { ES_HELP_LOCALE } from '../customer-help-locale';

export const esCustomerHelpPages: CustomerHelpPages = generateBaseHelpPagesByLocale(ES_HELP_LOCALE);
