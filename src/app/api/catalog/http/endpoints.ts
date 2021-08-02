import { environment } from '@environments/environment';

export const PUBLISHED_ITEMS_ENDPOINT = (userId: string) => `${environment.baseUrl}api/v3/users/${userId}/items`;
export const WALL_ENDPOINT = `${environment.baseUrl}api/v3/wall`;
