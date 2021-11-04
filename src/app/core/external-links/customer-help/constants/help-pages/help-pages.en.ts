import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { EN_HELP_LOCALE } from '../customer-help-locale';

export const enCustomerHelpPages: CustomerHelpPages = generateBaseHelpPagesByLocale(EN_HELP_LOCALE);
