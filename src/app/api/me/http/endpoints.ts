import { environment } from '@environments/environment';
import { NOTIFICATIONS_API_URL } from '@api/notifications/http/endpoints';

export const USER_API_URL = 'api/v3/user';

export const ME_FAVOURITES_ENDPOINT = `${environment.baseUrl}${USER_API_URL}/items/favorited`;

export const ME_SOLD_ITEMS_ENDPOINT = `${environment.baseUrl}${USER_API_URL}/items/sold`;

export const NOTIFICATIONS_API_URL_ENDPOINT = `${environment.baseUrl}${NOTIFICATIONS_API_URL}/me/config`;
export const BASE_SET_NOTIFICATION = `${environment.baseUrl}${NOTIFICATIONS_API_URL}/me`;
