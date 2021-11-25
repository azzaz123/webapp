import { environment } from '@environments/environment';

export const TRANSACTION_TRACKING_DETAILS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking-details`;
export const TRANSACTION_TRACKING_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking`;
export const TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking/instructions`;

export const TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT = (requestId) =>
  `${environment.baseUrl}/delivery/transaction/${requestId}/cancel/by_seller`;
export const TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT = (requestId) =>
  `${environment.baseUrl}/delivery/transactions/${requestId}/claim_period/by_buyer`;
export const TRANSACTION_TRACKING_PACKAGE_ARRIVED_ENDPOINT = (requestId) =>
  `${environment.baseUrl}/delivery/transaction/${requestId}/shipping/delivery/manual_by_buyer`;
