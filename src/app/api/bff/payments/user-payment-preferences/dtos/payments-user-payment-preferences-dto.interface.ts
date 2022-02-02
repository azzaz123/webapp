import { PaymentsUserPaymentAvailabilityDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-availability-dto.interface';
import { PaymentsUserPaymentPreferenceDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-preference-dto.interface';

export interface PaymentsUserPaymentPreferencesDto {
  defaults: PaymentsUserPaymentAvailabilityDto;
  preferences: PaymentsUserPaymentPreferenceDto;
}
