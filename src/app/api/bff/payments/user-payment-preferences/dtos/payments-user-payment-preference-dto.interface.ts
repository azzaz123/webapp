import { PaymentsUserPaymentAvailabilityDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-availability-dto.interface';

export interface PaymentsUserPaymentPreferenceDto extends PaymentsUserPaymentAvailabilityDto {
  id: string;
}
