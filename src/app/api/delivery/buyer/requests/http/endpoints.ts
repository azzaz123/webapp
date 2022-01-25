import { environment } from '@environments/environment';

const BUYER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}api/v3/delivery/buyer/requests`;

export const BUYER_REQUESTS_ENDPOINT_WITH_ITEM_HASH = (itemHash: string): string => `${BUYER_REQUESTS_ENDPOINT}${itemHash}`;
