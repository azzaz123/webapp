import { mapPaymentMethodDtoToPaymentMethod } from '@api/shared/mappers/payment-method-dto-to-payment-method.mapper';
import { PaymentsUserPaymentAvailability } from '@api/core/model/payments/interfaces/payments-user-payment-availability.interface';
import { PaymentsUserPaymentPreference } from '@api/core/model/payments/interfaces/payments-user-payment-preference.interface';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { InnerType, ToDomainMapper } from '@api/core/utils/types';
import { PaymentsUserPaymentPreferencesDto } from '../../dtos/responses/payments-user-payment-preferences-dto.interface';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { AVAILABLE_PAYMENT_METHODS } from '@api/core/model/payments/constants/available-payments';

type PaymentsUserPaymentDefaultsDto = InnerType<PaymentsUserPaymentPreferencesDto, 'defaults'>;
type PaymentsUserPaymentPreferenceDto = InnerType<PaymentsUserPaymentPreferencesDto, 'preferences'>;

export const mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences: ToDomainMapper<
  PaymentsUserPaymentPreferencesDto,
  PaymentsUserPaymentPreferences
> = (input: PaymentsUserPaymentPreferencesDto): PaymentsUserPaymentPreferences => {
  const { defaults, preferences } = input;

  return {
    defaults: mapToDefaults(defaults),
    preferences: preferences ? mapToPreference(preferences) : null,
  };
};

const mapToDefaults: ToDomainMapper<PaymentsUserPaymentDefaultsDto, PaymentsUserPaymentAvailability> = (
  defaults: PaymentsUserPaymentDefaultsDto
): PaymentsUserPaymentAvailability => {
  const { payment_method: paymentMethod, use_wallet: useWallet, wallet_blocked: walletBlocked } = defaults;
  const mappedPaymentMethod: PAYVIEW_PAYMENT_METHOD = paymentMethod ? mapPaymentMethodDtoToPaymentMethod(paymentMethod) : null;
  return {
    paymentMethod: mappedPaymentMethod ? mapToAvailablePayment(mappedPaymentMethod) : null,
    useWallet,
    walletBlocked,
  };
};

const mapToPreference: ToDomainMapper<PaymentsUserPaymentPreferenceDto, PaymentsUserPaymentPreference> = (
  preference: PaymentsUserPaymentPreferenceDto
): PaymentsUserPaymentPreference => {
  const { id, payment_method: paymentMethod, use_wallet: useWallet, wallet_blocked: walletBlocked } = preference;
  const mappedPaymentMethod: PAYVIEW_PAYMENT_METHOD = paymentMethod ? mapPaymentMethodDtoToPaymentMethod(paymentMethod) : null;
  return {
    id,
    paymentMethod: mappedPaymentMethod ? mapToAvailablePayment(mappedPaymentMethod) : null,
    useWallet,
    walletBlocked,
  };
};

const mapToAvailablePayment: ToDomainMapper<PAYVIEW_PAYMENT_METHOD, PAYVIEW_PAYMENT_METHOD> = (
  mappedPaymentMethod: PAYVIEW_PAYMENT_METHOD
): PAYVIEW_PAYMENT_METHOD => {
  if (AVAILABLE_PAYMENT_METHODS.includes(mappedPaymentMethod)) {
    return mappedPaymentMethod;
  }
  return AVAILABLE_PAYMENT_METHODS[0];
};
