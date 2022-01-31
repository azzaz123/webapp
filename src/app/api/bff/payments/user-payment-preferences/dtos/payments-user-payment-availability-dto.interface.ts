import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';

export interface PaymentsUserPaymentAvailabilityDto {
  payment_method: PaymentMethodDto;
  use_wallet: boolean;
  wallet_blocked: boolean;
}
