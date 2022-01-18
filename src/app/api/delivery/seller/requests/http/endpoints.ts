import { environment } from '@environments/environment';

export const SELLER_REQUESTS_ENDPOINT = (requestId: string) => `${environment.baseUrl}/api/v3/delivery/seller/requests/${requestId}`;
