import { environment } from '@environments/environment';

export const DELIVERY_COSTS_URL: string = `${environment.baseUrl}bff/delivery/costs`;
export const DELIVERY_COSTS_ENDPOINT = (itemId: string): string => `${DELIVERY_COSTS_URL}?item_id=${itemId}`;
