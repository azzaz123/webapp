import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';

const iconPath: string = '/assets/icons/payview/';

export const PAYVIEW_PAYMENT_ICONS: Record<PAYVIEW_PAYMENT_METHOD, string> = {
  [PAYVIEW_PAYMENT_METHOD.CREDIT_CARD]: `${iconPath}visa-mastercard.svg`,
  [PAYVIEW_PAYMENT_METHOD.PAYPAL]: `${iconPath}paypal.svg`,
  [PAYVIEW_PAYMENT_METHOD.WALLET]: `${iconPath}wallet.svg`,
  [PAYVIEW_PAYMENT_METHOD.WALLET_AND_CREDIT_CARD]: `${iconPath}wallet-card.svg`,
  [PAYVIEW_PAYMENT_METHOD.WALLET_AND_PAYPAL]: `${iconPath}wallet-paypal.svg`,
};
