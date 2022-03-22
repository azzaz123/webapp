import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';

const iconPath: string = '/assets/icons/payview/';

export const PAYVIEW_PAYMENT_ICONS: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: `${iconPath}visa-mastercard.svg`,
  [PaymentMethod.PAYPAL]: `${iconPath}paypal.svg`,
  [PaymentMethod.WALLET]: `${iconPath}wallet.svg`,
  [PaymentMethod.WALLET_AND_CREDIT_CARD]: `${iconPath}wallet-card.svg`,
  [PaymentMethod.WALLET_AND_PAYPAL]: `${iconPath}wallet-paypal.svg`,
};
