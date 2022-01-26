import { PaymentMethod } from '@api/shared/enums/payment-method.enum';

export interface PaymentsUserPaymentAvailability {
  paymentMethod: PaymentMethod;
  useWallet: boolean;
  walletBlocked: boolean;
}
