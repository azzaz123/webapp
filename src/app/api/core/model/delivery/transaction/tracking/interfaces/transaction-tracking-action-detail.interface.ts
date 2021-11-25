import { TransactionTrackingBanner } from '@api/core/model/delivery/transaction/tracking';

export type TransactionTrackingActionDetail =
  | TransactionTrackingActionCarrierTrackingWebview
  | TransactionTrackingActionDeeplink
  | TransactionTrackingActionDialog
  | TransactionTrackingActionUserAction
  | TransactionTrackingActionDismiss
  | TransactionTrackingActionReload;

export interface TransactionTrackingActionBase {
  analytics?: TransactionTrackingActionDetailAnalytics;
}

export interface TransactionTrackingActionCarrierTrackingWebview extends TransactionTrackingActionBase {
  isCarrierTrackingWebview: boolean;
  linkUrl: string;
  title: string;
}

export interface TransactionTrackingActionDeeplink extends TransactionTrackingActionBase {
  isDeeplink: boolean;
  linkUrl: string;
}

export interface TransactionTrackingActionDialog extends TransactionTrackingActionBase {
  description: string;
  isDialog: boolean;
  negative: TransactionTrackingActionNegative;
  positive: TransactionTrackingActionPositive;
  title: string;
}

export interface TransactionTrackingActionUserAction extends TransactionTrackingActionBase {
  isUserAction: boolean;
  name: string;
  success: TransactionTrackingActionDetail;
  transactionId: string;
}

export interface TransactionTrackingActionDismiss extends TransactionTrackingActionBase {
  isDismiss: boolean;
}

export interface TransactionTrackingActionReload extends TransactionTrackingActionBase {
  isReload: boolean;
}

export interface TransactionTrackingActionNegative {
  title: string;
}

export interface TransactionTrackingActionPositive extends TransactionTrackingActionNegative {
  action: TransactionTrackingActionDetail;
}

export interface TransactionTrackingActionDetailAnalytics {
  requestId: string;
  source: string;
  userId: string;
}
