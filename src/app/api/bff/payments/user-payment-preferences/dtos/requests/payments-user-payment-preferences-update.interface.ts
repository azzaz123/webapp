import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';

export interface PaymentsUserPaymentPreferencesUpdateDto {
  payment_method: PaymentMethodDto;
  use_wallet: boolean;
}
