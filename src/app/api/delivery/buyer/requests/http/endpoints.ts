import { environment } from '@environments/environment';

export const BUYER_REQUESTS_ITEMS_DETAILS = (itemHash: string): string =>
  `${environment.baseUrl}/api/v3/delivery/buyer/requests/items/${itemHash}/details`;
