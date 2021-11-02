import { TransactionTrackingHeader } from './header/transaction-tracking-header.interface';
import { TransactionTrackingShippingStatus } from './shipping-status/transaction-tracking-shipping-status.interface';
import { TransactionTrackingStatusInfo } from './status-info/transaction-tracking-status-info.interface';

export interface TransactionTracking {
  header: TransactionTrackingHeader;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
}
