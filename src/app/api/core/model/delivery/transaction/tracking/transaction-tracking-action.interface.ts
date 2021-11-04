export interface TransactionTrackingAction {
  analytics: TransactionTrackingActionAnalytics;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionPayload;
}
export interface TransactionTrackingActionAnalytics {
  request_id: string;
  source: string;
  user_id: string;
}
export interface TransactionTrackingActionPayload {
  description: string;
  linkUrl: string;
  negative: TransactionTrackingActionPayloadConfirmation;
  positive: TransactionTrackingActionPayloadConfirmation;
  title: string;
}
export interface TransactionTrackingActionPayloadConfirmation {
  action?: TransactionTrackingAction;
  title: string;
}
