import { environment } from '@environments/environment';

export const COMMUNICATIONS_CONSENT_SET_ENDPOINT = `${environment.baseUrl}api/v3/notifications/me`;
export const COMMUNICATIONS_CONSENT_ENDPOINT = `${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/config`;
