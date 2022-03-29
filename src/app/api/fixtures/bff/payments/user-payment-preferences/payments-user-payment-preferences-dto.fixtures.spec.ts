import { mapPaymentMethodDtoToPaymentMethod } from '@api/shared/mappers/payment-method-dto-to-payment-method.mapper';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesDto } from '@api/bff/payments/user-payment-preferences/dtos/responses/payments-user-payment-preferences-dto.interface';
import { PaymentsUserPaymentPreferencesUpdateDto } from '@api/bff/payments/user-payment-preferences/dtos/requests/payments-user-payment-preferences-update.interface';

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE: PaymentsUserPaymentPreferencesDto = {
  defaults: {
    payment_method: null,
    use_wallet: true,
    wallet_blocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    payment_method: 'paypal',
    use_wallet: false,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST: PaymentsUserPaymentPreferencesUpdateDto = {
  payment_method: 'paypal',
  use_wallet: false,
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    paymentMethod: mapPaymentMethodDtoToPaymentMethod('paypal'),
    useWallet: false,
    walletBlocked: false,
  },
};
