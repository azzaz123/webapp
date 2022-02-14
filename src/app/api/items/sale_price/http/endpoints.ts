import { environment } from '@environments/environment';

export const ITEM_SALE_PRICE_ENDPOINT = (itemHash: string) => `${environment.baseUrl}api/v3/items/${itemHash}/sale_price`;
