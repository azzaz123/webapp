import { TransactionTrackingShippingStatus } from './shipping-status/transaction-tracking-shipping-status.interface';
import { TransactionTrackingStatusInfo } from './status-info/transaction-tracking-status-info.interface';
import { TransactionTrackingAction } from './transaction-tracking-action.interface';
import { TransactionTrackingAnalytics } from './transaction-tracking-analytics.interface';

export interface TransactionTracking {
  analytics?: TransactionTrackingAnalytics;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
  title: string;
  topAction: TransactionTrackingAction;
}
