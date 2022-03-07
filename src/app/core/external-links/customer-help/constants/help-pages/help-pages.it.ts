import { CUSTOMER_HELP_PAGE } from '../../customer-help-constants';
import { CUSTOMER_HELP_SITE_BASE } from '../../enums/customer-help-site.enum';
import { generateBaseHelpPagesByLocale } from '../../functions/generate-help-pages-by-locale';
import { CustomerHelpPages } from '../../types/customer-help-pages.type';
import { IT_HELP_LOCALE } from '../customer-help-locale';

const baseHelpPages = generateBaseHelpPagesByLocale(IT_HELP_LOCALE);

export const itCustomerHelpPages: CustomerHelpPages = {
  ...baseHelpPages,
  [CUSTOMER_HELP_PAGE.HOME]: CUSTOMER_HELP_SITE_BASE.ITALIAN,
  [CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING]: `${CUSTOMER_HELP_SITE_BASE.ITALIAN}it/sections/4406213595665-Vendere-con-spedizione`,
  [CUSTOMER_HELP_PAGE.WALLET_HELP]: `${CUSTOMER_HELP_SITE_BASE.ITALIAN}it/articles/4406234107793-Cos-%C3%A8-il-portafoglio-`,
  [CUSTOMER_HELP_PAGE.VERIFY_MY_IDENTITY]: `${CUSTOMER_HELP_SITE_BASE.ITALIAN}it/articles/4406234737425-Verificare-la-mia-identit%C3%A0`,
  [CUSTOMER_HELP_PAGE.PAYVIEW]: `${CUSTOMER_HELP_SITE_BASE.ITALIAN}it/articles/4406234851089-Inizia-a-fare-acquisti-con-Spedizioni-Wallapop`,
  [CUSTOMER_HELP_PAGE.PAYVIEW_DELIVERY]: `${CUSTOMER_HELP_SITE_BASE.ITALIAN}it/articles/4420390252433-Come-proteggiamo-le-tue-spedizioni`,
};
