import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesDto } from '@api/bff/payments/user-payment-preferences/dtos/responses/payments-user-payment-preferences-dto.interface';
import { PaymentsUserPaymentPreferencesUpdateDto } from '@api/bff/payments/user-payment-preferences/dtos/requests/payments-user-payment-preferences-update.interface';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE: PaymentsUserPaymentPreferencesDto = {
  defaults: {
    payment_method: 'credit card',
    use_wallet: true,
    wallet_blocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    payment_method: 'credit card',
    use_wallet: false,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_ID_RESPONSE: PaymentsUserPaymentPreferencesDto = {
  ...MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  preferences: {
    payment_method: 'credit card',
    use_wallet: false,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_PREFERENCES: PaymentsUserPaymentPreferencesDto = {
  ...MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    payment_method: 'paypal',
    use_wallet: false,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_DEFAULTS: PaymentsUserPaymentPreferencesDto = {
  ...MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  defaults: {
    payment_method: 'paypal',
    use_wallet: true,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD_RESPONSE: PaymentsUserPaymentPreferencesDto = {
  defaults: {
    payment_method: null,
    use_wallet: true,
    wallet_blocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    payment_method: null,
    use_wallet: false,
    wallet_blocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE_RESPONSE: PaymentsUserPaymentPreferencesDto = {
  defaults: {
    payment_method: null,
    use_wallet: true,
    wallet_blocked: false,
  },
  preferences: null,
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
    isNewBuyer: false,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.PAYPAL,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES: PaymentsUserPaymentPreferences = {
  ...MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: true,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.PAYPAL,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,

    paymentMethod: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '198b2073-f719-4c41-88cd-eee661f99cee',
    isNewBuyer: true,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: null,
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,
    paymentMethod: null,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_CREDIT_CARD: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
    useWallet: false,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_WALLET: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.WALLET,
    useWallet: true,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_WALLET_AND_CREDIT_CARD: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.WALLET_AND_CREDIT_CARD,
    useWallet: true,
    walletBlocked: false,
  },
};

export const MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_WALLET_AND_PAYPAL: PaymentsUserPaymentPreferences = {
  defaults: {
    paymentMethod: null,
    useWallet: true,
    walletBlocked: false,
  },
  preferences: {
    id: '46211e5c-5d3c-4794-9f45-c10b5f117860',
    isNewBuyer: false,
    paymentMethod: PAYVIEW_PAYMENT_METHOD.WALLET_AND_PAYPAL,
    useWallet: true,
    walletBlocked: false,
  },
};
