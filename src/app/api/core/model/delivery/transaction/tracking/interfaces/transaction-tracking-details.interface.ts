import {
  TransactionTrackingDetailsItem,
  TransactionTrackingDetailsUser,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingDetails {
  info: TransactionTrackingStatusInfo[];
  item: TransactionTrackingDetailsItem;
  title: string;
  user: TransactionTrackingDetailsUser;
}
