import { TransactionTrackingHeader } from './header/transaction-tracking-header.interface';
import { TransactionTrackingShippingStatus } from './shipping-status/transaction-tracking-shipping-status.interface';
import { TransactionTrackingStatusInfo } from './status-info/transaction-tracking-status-info.interface';
import { TransactionTrackingAnalytics } from './transaction-tracking-analytics.interface';

export interface TransactionTracking {
  analytics?: TransactionTrackingAnalytics;
  header: TransactionTrackingHeader;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
  title: string;
}
