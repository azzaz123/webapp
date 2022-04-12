import { UserPaymentPreferencesErrorTranslations } from './user-payment-preferences-translations';
import { UserPaymentPreferencesError } from './user-payment-preferences.error';

export class UserPaymentPreferencesUnknownError extends UserPaymentPreferencesError {
  constructor() {
    super(UserPaymentPreferencesErrorTranslations.USER_PAYMENT_PREFERENCES_UNKOWN_ERROR);
  }
}
