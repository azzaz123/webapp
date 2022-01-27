import { environment } from '@environments/environment';

export const BUYER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}api/v3/delivery/buyer/requests`;

export const BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY: string = 'item_hash';
export const BUYER_REQUESTS_ITEMS_DETAILS = (itemHash: string): string =>
  `${environment.baseUrl}${BUYER_REQUESTS_ENDPOINT}/items/${itemHash}/details`;
