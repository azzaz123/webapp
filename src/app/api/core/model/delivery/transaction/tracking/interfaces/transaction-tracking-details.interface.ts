import { TransactionTrackingDetailsInfo } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingDetails {
  info: TransactionTrackingDetailsInfo[];
  item: TransactionTrackingDetailsItem;
  title: string;
  user: TransactionTrackingDetailsUser;
}
