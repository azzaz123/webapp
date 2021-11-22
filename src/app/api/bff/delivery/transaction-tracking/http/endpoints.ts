import { environment } from '@environments/environment';

export const TRANSACTION_TRACKING_DETAILS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking-details`;
export const TRANSACTION_TRACKING_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking`;
export const TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking/instructions`;

export const TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT = `${environment.baseUrl}/delivery/transaction/{0}/cancel/by_seller`;
export const TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT = `${environment.baseUrl}/delivery/transactions/{0}/claim_period/by_buyer`;
export const TRANSACTION_TRACKING_PACKAGE_ARRIVED_ENDPOINT = `${environment.baseUrl}/delivery/transaction/{0}/shipping/delivery/manual_by_buyer`;
