import { CUSTOMER_HELP_PAGE } from '../enums/customer-help-page.enum';
import { EXTERNAL_CUSTOMER_HELP_PAGE_ID } from '../enums/external-customer-help-page-id.enum';
import { getCustomerHelpUrl } from '../get-customer-help-url';
import { CustomerHelpPages } from '../types/customer-help-pages.type';
import { HELP_LOCALE } from '../types/help-locale';

export function generateBaseHelpPagesByLocale(locale: HELP_LOCALE): CustomerHelpPages {
  return {
    [CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING]: getCustomerHelpUrl(
      EXTERNAL_CUSTOMER_HELP_PAGE_ID.SHIPPING_SELL_WITH_SHIPPING,
      locale
    ),
    [CUSTOMER_HELP_PAGE.PROS_REAL_ESTATE_SUBSCRIPTION]: getCustomerHelpUrl(
      EXTERNAL_CUSTOMER_HELP_PAGE_ID.PROS_REAL_ESTATE_SUBSCRIPTION,
      locale
    ),
    [CUSTOMER_HELP_PAGE.PROS_CONSUMER_GOODS_SUBSCRIPTION]: getCustomerHelpUrl(
      EXTERNAL_CUSTOMER_HELP_PAGE_ID.PROS_CONSUMER_GOODS_SUBSCRIPTION,
      locale
    ),
    [CUSTOMER_HELP_PAGE.WALLET_HELP]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.WALLET_HELP, locale),
    [CUSTOMER_HELP_PAGE.CHANGE_PRO_SUBSCRIPTION]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.CHANGE_PRO_SUBSCRIPTION, locale),
    [CUSTOMER_HELP_PAGE.MOTORBIKE_SUBSCRIPTION]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.MOTORBIKE_SUBSCRIPTION, locale),
    [CUSTOMER_HELP_PAGE.CAR_PARTS_SUBSCRIPTION]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.CAR_PARTS_SUBSCRIPTION, locale),
    [CUSTOMER_HELP_PAGE.CARS_SUBSCRIPTION]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.CARS_SUBSCRIPTION, locale),
    [CUSTOMER_HELP_PAGE.REAL_ESTATE_SUBSCRIPTION]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.REAL_ESTATE_SUBSCRIPTION, locale),
    [CUSTOMER_HELP_PAGE.EVERYTHING_ELSE_SUBSCRIPTION]: getCustomerHelpUrl(
      EXTERNAL_CUSTOMER_HELP_PAGE_ID.EVERYTHING_ELSE_SUBSCRIPTION,
      locale
    ),
    [CUSTOMER_HELP_PAGE.BILLING_INFO]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.BILLING_INFO, locale),
    [CUSTOMER_HELP_PAGE.VERIFY_MY_IDENTITY]: getCustomerHelpUrl(EXTERNAL_CUSTOMER_HELP_PAGE_ID.VERIFY_MY_IDENTITY, locale),
  };
}