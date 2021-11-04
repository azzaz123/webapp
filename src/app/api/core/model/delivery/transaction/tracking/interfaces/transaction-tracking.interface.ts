import { TransactionTrackingAction } from './transaction-tracking-action.interface';
import { TransactionTrackingAnalytics } from './transaction-tracking-analytics.interface';
import { TransactionTrackingShippingStatus } from './transaction-tracking-shipping-status.interface';
import { TransactionTrackingStatusInfo } from './transaction-tracking-status-info.interface';

export interface TransactionTracking {
  analytics?: TransactionTrackingAnalytics;
  header: TransactionTrackingAction;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
  title: string;
}
