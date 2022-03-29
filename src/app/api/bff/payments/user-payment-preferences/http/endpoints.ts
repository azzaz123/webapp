import { environment } from '@environments/environment';

const PAYMENTS_URL: string = `${environment.baseUrl}bff/payments`;
export const USER_PAYMENT_PREFERENCES_ENDPOINT: string = `${PAYMENTS_URL}/user_payment_preferences`;
export const USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT = (preferencesId: string) =>
  `${environment.baseUrl}api/v3/payments/user_payment_preferences/${preferencesId}`;
