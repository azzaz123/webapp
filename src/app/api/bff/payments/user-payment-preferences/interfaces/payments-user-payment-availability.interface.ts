import { PaymentsPaymentMethod } from '@api/bff/payments/user-payment-preferences/types/payments-payment-method.type';

export interface PaymentsUserPaymentAvailability {
  paymentMethod: PaymentsPaymentMethod;
  useWallet: boolean;
  walletBlocked: boolean;
}
