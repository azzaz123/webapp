import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { ToApiMapper } from '@api/core/utils/types';
import { PaymentsUserPaymentPreferencesUpdateDto } from '../../dtos/requests/payments-user-payment-preferences-update.interface';
import { mapPaymentMethodToPaymentMethodDto } from '@api/shared/mappers/payment-method-to-payment-method-dto.mapper';

export const mapUserPaymentsPreferencesToDto: ToApiMapper<PaymentsUserPaymentPreferences, PaymentsUserPaymentPreferencesUpdateDto> = (
  input: PaymentsUserPaymentPreferences
): PaymentsUserPaymentPreferencesUpdateDto => {
  const { preferences } = input;
  const { paymentMethod, useWallet: use_wallet } = preferences;

  return {
    payment_method: mapPaymentMethodToPaymentMethodDto(paymentMethod),
    use_wallet,
  };
};
