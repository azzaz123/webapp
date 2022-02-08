import { environment } from '@environments/environment';

const SELLER_REQUESTS_ENDPOINT: string = `${environment.baseUrl}api/v3/delivery/seller/requests/`;

export const SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID = (requestId: string): string => `${SELLER_REQUESTS_ENDPOINT}${requestId}`;
export const SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID = (requestId: string): string =>
  `${SELLER_REQUESTS_ENDPOINT}${requestId}/accept/post-office-drop-off`;
export const SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID = (requestId: string): string =>
  `${SELLER_REQUESTS_ENDPOINT}${requestId}/accept/home-pickup`;
