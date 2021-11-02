import { TransactionTrackingTopAction } from './header/transaction-tracking-top-action.interface';

export interface TransactionTrackingAction {
  analytics: unknown;
  payload: TransactionTrackingActionPayload;
  type: TransactionTrackingActionType;
}
export type TransactionTrackingActionType = 'deeplink' | 'dialog' | 'user_action' | 'carrier_tracking_webview';
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
