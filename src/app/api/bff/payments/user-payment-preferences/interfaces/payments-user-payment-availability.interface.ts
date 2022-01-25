import { PaymentMethod } from '@api/shared/types/payment-method.type';

export interface PaymentsUserPaymentAvailability {
  paymentMethod: PaymentMethod;
  useWallet: boolean;
  walletBlocked: boolean;
}
