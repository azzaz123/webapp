import { PaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-preferences-dto.interface';

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

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    paymentMethod: 'paypal',
    useWallet: false,
    walletBlocked: false,
  },
};
