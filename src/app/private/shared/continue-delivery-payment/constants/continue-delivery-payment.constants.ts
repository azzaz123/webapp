import { environment } from '@environments/environment';

export const START_DELIVERY_PAYMENT_URL = (id: string) => `${environment.baseUrl}api/v3/delivery/request/payment/start/${id}`;
