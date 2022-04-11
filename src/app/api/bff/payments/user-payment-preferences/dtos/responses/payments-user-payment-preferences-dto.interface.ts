import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';

export interface PaymentsUserPaymentPreferencesDto {
  defaults: {
    payment_method: PaymentMethodDto | null;
    use_wallet: boolean;
    wallet_blocked: boolean;
  };
  preferences: {
    id?: string;
    payment_method: PaymentMethodDto;
    use_wallet: boolean;
    wallet_blocked: boolean;
  };
}
