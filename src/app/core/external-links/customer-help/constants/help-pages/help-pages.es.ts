import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { SPANISH_HELP_LOCALE } from '../customer-help-locale';

export const spanishCustomerHelpPages: CustomerHelpPages = generateBaseHelpPagesByLocale(SPANISH_HELP_LOCALE);
