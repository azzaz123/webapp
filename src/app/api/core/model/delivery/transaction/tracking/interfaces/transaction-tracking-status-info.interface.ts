import { TransactionTrackingActionDetail } from './transaction-tracking-action-detail.interface';
import { TransactionTrackingStyle } from './transaction-tracking-style.interface';

// refactor it with necesary params
export interface TransactionTrackingStatusInfo {
  action: TransactionTrackingActionDetail;
  description: string;
  icon: TransactionTrackingStatusInfoIcon;
  showCaret: boolean;
}
export interface TransactionTrackingStatusInfoIcon {
  url: string;
  thumbnailUrl: string;
  style: TransactionTrackingStyle;
}
