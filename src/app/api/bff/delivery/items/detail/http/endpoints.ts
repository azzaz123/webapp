import { environment } from '@environments/environment';

export const DELIVERY_ITEM_DETAILS_ENDPOINT: (itemHash: string) => string = (itemHash: string) =>
  `${environment.baseUrl}bff/delivery/items/${itemHash}/detail/item-detail`;
