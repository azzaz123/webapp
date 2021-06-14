import { environment } from '@environments/environment';

export const PUBLISHED_ITEMS_ENDPOINT = (userId: string) => `${environment.baseUrl}api/v3/users/${userId}/items`;
