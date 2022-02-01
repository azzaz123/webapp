import { environment } from '@environments/environment';

const CARRIER_DROP_OFF_MODE_REQUEST: string = `${environment.baseUrl}api/v3/delivery/carrier-drop-off-mode/request/`;

export const CARRIER_DROP_OFF_MODE_REQUEST_WITH_REQUEST_ID = (requestId: string): string => `${CARRIER_DROP_OFF_MODE_REQUEST}${requestId}`;
