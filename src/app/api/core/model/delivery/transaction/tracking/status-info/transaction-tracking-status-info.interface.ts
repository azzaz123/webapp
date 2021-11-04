import { TransactionTrackingActionDetail } from '../transaction-tracking-action-detail.interface';
import { TransactionTrackingStyle } from '../transaction-tracking-style.interface';

export interface TransactionTrackingStatusInfo {
  action: TransactionTrackingActionDetail;
  actionIcon: TransactionTrackingStyle;
  description: string;
  icon: TransactionTrackingStatusInfoIcon;
}
export interface TransactionTrackingStatusInfoIcon {
  url: string;
  thumbnailUrl: string;
  style: TransactionTrackingStyle;
}
