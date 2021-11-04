export interface TransactionTrackingActionDetail {
  analytics: TransactionTrackingActionAnalytics;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionPayload;
}
export interface TransactionTrackingActionAnalytics {
  requestId: string;
  source: string;
  userId: string;
}
export interface TransactionTrackingActionPayload {
  banner?: TransactionTrackingActionPayloadBanner;
  description?: string;
  linkUrl?: string;
  name?: string;
  negative?: TransactionTrackingActionPayloadConfirmation;
  parameters?: TransactionTrackingActionPayloadParameters;
  positive?: TransactionTrackingActionPayloadConfirmation;
  success?: TransactionTrackingActionDetail;
  title?: string;
}
export interface TransactionTrackingActionPayloadBanner {
  title: string;
  trackingCode: string;
}
export interface TransactionTrackingActionPayloadConfirmation {
  action?: TransactionTrackingActionDetail;
  title: string;
}
export interface TransactionTrackingActionPayloadParameters {
  transactionId: string;
}
