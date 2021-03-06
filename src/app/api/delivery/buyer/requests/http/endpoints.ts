import { environment } from '@environments/environment';

export const BUYER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}api/v3/delivery/buyer/requests`;

export const BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY: string = 'item_hash';
export const BUYER_REQUESTS_ITEMS_DETAILS = (itemHash: string): string => `${BUYER_REQUESTS_ENDPOINT}/items/${itemHash}/details`;
export const BUYER_CANCEL_REQUEST_ENDPOINT = (requestId: string): string => `${BUYER_REQUESTS_ENDPOINT}/${requestId}/charge/cancel`;
