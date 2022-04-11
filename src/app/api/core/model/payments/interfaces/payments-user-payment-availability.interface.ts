import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';

export interface PaymentsUserPaymentAvailability {
  paymentMethod: PAYVIEW_PAYMENT_METHOD;
  useWallet: boolean;
  walletBlocked: boolean;
}
