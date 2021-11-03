export interface TransactionTrackingAction {
  analytics: unknown;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionPayload;
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
