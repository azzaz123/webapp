export interface TransactionTrackingActionDetail {
  analytics?: TransactionTrackingActionDetailAnalytics;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionDetailPayload;
}
export interface TransactionTrackingActionDetailAnalytics {
  requestId: string;
  source: string;
  userId: string;
}
export interface TransactionTrackingActionDetailPayload {
  banner?: TransactionTrackingActionDetailPayloadBanner;
  description?: string;
  linkUrl?: string;
  name?: string;
  negative?: TransactionTrackingActionDetailPayloadConfirmation;
  parameters?: TransactionTrackingActionDetailPayloadParameters;
  positive?: TransactionTrackingActionDetailPayloadConfirmation;
  success?: TransactionTrackingActionDetail;
  title?: string;
}
export interface TransactionTrackingActionDetailPayloadBanner {
  title: string;
  trackingCode: string;
}
export interface TransactionTrackingActionDetailPayloadConfirmation {
  action?: TransactionTrackingActionDetail;
  title: string;
}
export interface TransactionTrackingActionDetailPayloadParameters {
  transactionId: string;
}
