import { environment } from '@environments/environment';

export const TRANSACTION_TRACKING_DETAILS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking-details`;
export const TRANSACTION_TRACKING_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking`;
export const TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT = `${environment.baseUrl}bff/delivery/transaction-tracking/instructions`;
