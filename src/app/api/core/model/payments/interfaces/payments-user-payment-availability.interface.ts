import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';

export interface PaymentsUserPaymentAvailability {
  paymentMethod: PaymentMethod;
  useWallet: boolean;
  walletBlocked: boolean;
}
