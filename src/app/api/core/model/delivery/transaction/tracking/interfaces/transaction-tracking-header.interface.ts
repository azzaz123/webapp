import { TransactionTrackingCta } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingHeader {
  detail?: TransactionTrackingCta;
  title: string;
}
