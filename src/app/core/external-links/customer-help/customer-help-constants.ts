import { APP_LOCALE } from '@configs/subdomains.config';

type HelpLocaleId = 'es-es' | 'en-us' | 'it';

export const HELP_LOCALE: Record<APP_LOCALE, HelpLocaleId> = {
  es: 'es-es',
  en: 'en-us',
  it: 'it',
};

export enum CUSTOMER_HELP_BASE {
  DEFAULT = 'https://ayuda.wallapop.com/hc/',
  ITALIAN_SITE = 'https://assistenza.wallapop.com/hc/',
}

export enum CUSTOMER_HELP_PAGE {
  SHIPPING_SELL_WITH_SHIPPING = 360013381078,
  PROS_REAL_ESTATE_SUBSCRIPTION = 4403261623185,
  PROS_CONSUMER_GOODS_SUBSCRIPTION = 360002050398,
  WALLET_HELP = 360017172677,
  CHANGE_PRO_SUBSCRIPTION = 360005113638,
  MOTORBIKE_SUBSCRIPTION = 360010832557,
  CAR_PARTS_SUBSCRIPTION = 360000493638,
  CARS_SUBSCRIPTION = 360002041917,
  REAL_ESTATE_SUBSCRIPTION = 4403261623185,
  EVERYTHING_ELSE_SUBSCRIPTION = 360002050398,
  BILLING_INFO = 360012703497,
  VERIFY_MY_IDENTITY = 360004532117,
}

export enum ITALIAN_CUSTOMER_HELP_PAGE {
  WALLET_HELP = 4406234107793,
}

export enum CUSTOMER_TICKET_FORM {
  KYC = 360000110357,
}
