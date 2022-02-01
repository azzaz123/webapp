import { environment } from '@environments/environment';

const PAYMENTS_URL: string = `${environment.baseUrl}api/v3/payments`;
export const PAYMENTS_PAYMENT_METHODS_ENDPOINT: string = `${PAYMENTS_URL}/payment-methods`;
