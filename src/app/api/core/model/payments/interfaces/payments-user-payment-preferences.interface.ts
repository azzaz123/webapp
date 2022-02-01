import { PaymentsUserPaymentAvailability } from '@api/core/model/payments/interfaces/payments-user-payment-availability.interface';
import { PaymentsUserPaymentPreference } from '@api/core/model/payments/interfaces/payments-user-payment-preference.interface';

export interface PaymentsUserPaymentPreferences {
  defaults: PaymentsUserPaymentAvailability;
  preferences: PaymentsUserPaymentPreference;
}
