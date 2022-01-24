import { PaymentsPaymentMethod } from '@api/bff/payments/user-payment-preferences/types/payments-payment-method.type';

export interface PaymentsUserPaymentAvailabilityDto {
  payment_method: PaymentsPaymentMethod;
  use_wallet: boolean;
  wallet_blocked: boolean;
}
