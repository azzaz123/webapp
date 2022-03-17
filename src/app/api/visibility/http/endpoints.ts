import { WEB_ITEMS_API_URL } from '@core/item/item.service';
import { environment } from '@environments/environment';

export const BUMPS_PACKAGE_BALANCE = (userId: string) => `${environment.baseUrl}api/v3/visibility/bumps/${userId}/balance`;

export const BUMPS_PACKAGE_USE = `${environment.baseUrl}api/v3/visibility/bumps`;

export const ITEMS_WITH_PRODUCTS = `${environment.baseUrl}${WEB_ITEMS_API_URL}/available-visibility-products`;

export const ITEM_BUMPS_PACKAGE_BALANCE = (userId: string) => `${environment.baseUrl}api/v3/visibility/bumps/${userId}/items/check-balance`;
