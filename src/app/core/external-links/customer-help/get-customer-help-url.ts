import { CUSTOMER_HELP_SITE_BASE } from './enums/customer-help-site.enum';
import { EXTERNAL_CUSTOMER_HELP_PAGE_ID, EXTERNAL_ITALIAN_CUSTOMER_HELP_PAGE_ID } from './enums/external-customer-help-page-id.enum';
import { HELP_LOCALE } from './types/help-locale';

type UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID = EXTERNAL_CUSTOMER_HELP_PAGE_ID | EXTERNAL_ITALIAN_CUSTOMER_HELP_PAGE_ID;

export function getCustomerHelpUrl(
  pageId: UNIFIED_EXTERNAL_CUSTOMER_HELP_PAGE_ID,
  helpLocale: HELP_LOCALE,
  baseUrl = CUSTOMER_HELP_SITE_BASE.DEFAULT
): string {
  return `${baseUrl}${helpLocale}/articles/${pageId}`;
}
