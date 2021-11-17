import { TransactionTrackingAction } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingHeader {
  detail: TransactionTrackingAction;
  title: string;
}
