import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE_BY_APP_LOCALE } from '../customer-help/constants/customer-help-locale';
import { CUSTOMER_HELP_SITE_BASE } from '../customer-help/enums/customer-help-site.enum';

export function mapDeeplinkToCustomerHelp(locale: APP_LOCALE, deeplink: string): string {
  const HELP_LOCALE = HELP_LOCALE_BY_APP_LOCALE[locale];
  const regExp: RegExp = new RegExp(/[?&]z=([^&]+).*$/);
  const matches = deeplink.match(regExp);
  if (!!matches && matches.length >= 0 && matches[0].length >= 4) {
    const article: string = matches[0].substring(3);
    return `${CUSTOMER_HELP_SITE_BASE.DEFAULT}${HELP_LOCALE}/articles/${article}`;
  }
  return null;
}
