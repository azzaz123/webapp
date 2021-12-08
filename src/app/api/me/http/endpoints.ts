import { environment } from '@environments/environment';

export const USER_API_URL = 'api/v3/user';

export const ME_FAVOURITES_ENDPOINT = `${environment.baseUrl}${USER_API_URL}/items/favorited`;

export const ME_SOLD_ITEMS_ENDPOINT = `${environment.baseUrl}${USER_API_URL}/items`;
