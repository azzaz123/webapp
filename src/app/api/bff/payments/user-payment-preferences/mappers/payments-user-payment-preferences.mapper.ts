import { PaymentMethod } from '@api/shared/enums/payment-method.enum';
import { PaymentsUserPaymentAvailability } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-availability.interface';
import { PaymentsUserPaymentAvailabilityDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-availability-dto.interface';
import { PaymentsUserPaymentPreference } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preference.interface';
import { PaymentsUserPaymentPreferenceDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-preference-dto.interface';
import { PaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-preferences-dto.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences: ToDomainMapper<
  PaymentsUserPaymentPreferencesDto,
  PaymentsUserPaymentPreferences
> = (input: PaymentsUserPaymentPreferencesDto): PaymentsUserPaymentPreferences => {
  const { defaults, preferences } = input;

  return {
    defaults: mapToAvailability(defaults),
    preferences: mapToPreference(preferences),
  };
};

const mapToAvailability: ToDomainMapper<PaymentsUserPaymentAvailabilityDto, PaymentsUserPaymentAvailability> = (
  defaults: PaymentsUserPaymentAvailabilityDto
): PaymentsUserPaymentAvailability => {
  const { payment_method: paymentMethod, use_wallet: useWallet, wallet_blocked: walletBlocked } = defaults;
  return {
    paymentMethod: paymentMethod as PaymentMethod,
    useWallet,
    walletBlocked,
  };
};

const mapToPreference: ToDomainMapper<PaymentsUserPaymentPreferenceDto, PaymentsUserPaymentPreference> = (
  preference: PaymentsUserPaymentPreferenceDto
): PaymentsUserPaymentPreference => {
  const { id, payment_method: paymentMethod, use_wallet: useWallet, wallet_blocked: walletBlocked } = preference;
  return {
    id,
    paymentMethod: paymentMethod as PaymentMethod,
    useWallet,
    walletBlocked,
  };
};
