import { environment } from '@environments/environment';

export const BUMPS_PACKAGE_BALANCE = (user_id: string) => `${environment.baseUrl}api/v3/visibility/bumps/${user_id}/balance`;

export const BUMPS_PACKAGE_USE = '${environment.baseUrl}api/v3/visibility/bumps';
