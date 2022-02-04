import { environment } from '@environments/environment';

export const NOTIFICATIONS_API_URL = 'api/v3/notifications';
export const NOTIFICATIONS_API_URL_ENDPOINT = `${environment.baseUrl}${NOTIFICATIONS_API_URL}/me/config`;
export const BASE_SET_NOTIFICATION = `${environment.baseUrl}${NOTIFICATIONS_API_URL}/me`;
