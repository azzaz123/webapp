import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { ENGLISH_HELP_LOCALE } from '../customer-help-locale';

export const englishCustomerHelpPages: CustomerHelpPages = generateBaseHelpPagesByLocale(ENGLISH_HELP_LOCALE);
