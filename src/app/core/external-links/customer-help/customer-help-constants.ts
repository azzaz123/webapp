export type HelpLocaleId = 'es' | 'en' | 'it';

export enum HELP_LOCALE {
  es = 'es-es',
  en = 'en-us',
  it = 'en-us', // default english because the page does not exist in italian
}

export enum CUSTOMER_HELP_PAGE {
  SHIPPING_SELL_WITH_SHIPPING = 360013381078,
  WALLET_HELP = 360017172677,
}

export enum CUSTOMER_TICKET_FORM {
  BLOCKED_BY_MANGOPAY = 360003304097,
}
