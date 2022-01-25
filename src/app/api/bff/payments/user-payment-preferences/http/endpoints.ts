import { environment } from '@environments/environment';

const PAYMENTS_URL: string = `${environment.baseUrl}api/v3/payments`;
export const USER_PAYMENT_PREFERENCES_ENDPOINT: string = `${PAYMENTS_URL}/payment-methods`;
