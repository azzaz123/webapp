import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE_BY_APP_LOCALE } from '../customer-help/constants/customer-help-locale';
import { EXTERNAL_CUSTOMER_HELP_PAGE_ID } from '../customer-help/enums/external-customer-help-page-id.enum';
import { getCustomerHelpUrl } from '../customer-help/get-customer-help-url';

export function mapDeeplinkToCustomerHelp(locale: APP_LOCALE, deeplink: string): string {
  const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[locale];
  const articleId = deeplink.split('z=')[1] ?? null;
  let customerHelpPage: string = null;
  if (articleId) {
    customerHelpPage = getCustomerHelpUrl(articleId as unknown as EXTERNAL_CUSTOMER_HELP_PAGE_ID, HELP_LOCALE);
  }

  return customerHelpPage;
}
