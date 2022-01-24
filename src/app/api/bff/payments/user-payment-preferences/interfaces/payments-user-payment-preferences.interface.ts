import { PaymentsUserPaymentAvailability } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-availability.interface';
import { PaymentsUserPaymentPreference } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preference.interface';

export interface PaymentsUserPaymentPreferences {
  defaults: PaymentsUserPaymentAvailability;
  preferences: PaymentsUserPaymentPreference;
}
