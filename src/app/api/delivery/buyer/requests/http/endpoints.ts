import { environment } from '@environments/environment';

export const BUYER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}api/v3/delivery/buyer/requests`;

export const BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY = 'item_hash';
