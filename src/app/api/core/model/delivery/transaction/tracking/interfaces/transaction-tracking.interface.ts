import {
  TransactionTrackingAnalytics,
  TransactionTrackingHeader,
  TransactionTrackingShippingStatus,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTracking {
  analytics?: TransactionTrackingAnalytics;
  header: TransactionTrackingHeader;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
}
