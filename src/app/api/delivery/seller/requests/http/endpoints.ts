import { environment } from '@environments/environment';

const SELLER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}/api/v3/delivery/seller/requests/`;

export const SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID = (requestId: string): string => `${SELLER_REQUESTS_ENDPOINT}${requestId}`;
