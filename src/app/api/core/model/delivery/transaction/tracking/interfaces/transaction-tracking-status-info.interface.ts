import { TransactionTrackingActionDetail, TransactionTrackingStyle } from '@api/core/model/delivery/transaction/tracking';

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
