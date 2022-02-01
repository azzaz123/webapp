import { environment } from '@environments/environment';

export const DELIVERY_BUYER_URL: string = `${environment.baseUrl}bff/delivery/buyer`;
export const DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT = (itemHash: string): string =>
  `${DELIVERY_BUYER_URL}/delivery-methods?item_hash=${itemHash}`;
