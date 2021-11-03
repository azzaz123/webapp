import { TransactionTrackingAnimation } from '../transaction-tracking-animation.interface';

export interface TransactionTrackingShippingStatus {
  actions: unknown[];
  animation: TransactionTrackingAnimation;
  description: string;
  title: string;
}
