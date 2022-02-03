import { CreditCard } from '@api/core/model';
import { Money } from '@api/core/model/money.interface';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';

export interface PayviewStatePayment {
  card: CreditCard;
  methods: PaymentsPaymentMethods;
  preferences: PaymentsUserPaymentPreferences;
  wallet: Money;
}
