export type HelpLocaleId = 'es' | 'en' | 'it';

export enum HELP_LOCALE {
  es = 'es-es',
  en = 'en-us',
  it = 'en-us', // default english because the page does not exist in italian
}

export enum CUSTOMER_HELP_PAGE {
  SHIPPING_SELL_WITH_SHIPPING = 360013381078,
  PROS_REAL_ESTATE_SUBSCRIPTION = 4403261623185,
  PROS_CONSUMER_GOODS_SUBSCRIPTION = 360002050398,
}
