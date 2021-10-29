import { APP_LOCALE } from '@configs/subdomains.config';
import { CUSTOMER_HELP_PAGE, HELP_LOCALE, CUSTOMER_HELP_BASE } from './customer-help-constants';

export function getCustomerHelpUrl(pageId: CUSTOMER_HELP_PAGE, locale: APP_LOCALE, baseUrl = CUSTOMER_HELP_BASE.DEFAULT): string {
  return `${baseUrl}${HELP_LOCALE[locale]}/articles/${pageId}`;
}
