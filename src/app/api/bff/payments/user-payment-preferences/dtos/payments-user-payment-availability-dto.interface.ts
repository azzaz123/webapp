import { PaymentMethod } from '@api/shared/types/payment-method.type';

export interface PaymentsUserPaymentAvailabilityDto {
  payment_method: PaymentMethod;
  use_wallet: boolean;
  wallet_blocked: boolean;
}
