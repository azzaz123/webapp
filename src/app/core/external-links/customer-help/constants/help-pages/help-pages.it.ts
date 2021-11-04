import { CUSTOMER_HELP_PAGE } from '../../customer-help-constants';
import { CUSTOMER_HELP_SITE_BASE } from '../../enums/customer-help-site.enum';
import { EXTERNAL_ITALIAN_CUSTOMER_HELP_PAGE_ID } from '../../enums/external-customer-help-page-id.enum';
import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { getCustomerHelpUrl } from '../../get-customer-help-url';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { IT_HELP_LOCALE } from '../customer-help-locale';

const baseHelpPages = generateBaseHelpPagesByLocale(IT_HELP_LOCALE);

export const itCustomerHelpPages: CustomerHelpPages = {
  ...baseHelpPages,
  [CUSTOMER_HELP_PAGE.WALLET_HELP]: getCustomerHelpUrl(
    EXTERNAL_ITALIAN_CUSTOMER_HELP_PAGE_ID.WALLET_HELP,
    IT_HELP_LOCALE,
    CUSTOMER_HELP_SITE_BASE.ITALIAN
  ),
};
