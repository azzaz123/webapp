import { TransactionTrackingAnimation, TransactionTrackingCta } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingShippingStatus {
  actions: TransactionTrackingCta[];
  animation: TransactionTrackingAnimation;
  description: string;
  title: string;
}
