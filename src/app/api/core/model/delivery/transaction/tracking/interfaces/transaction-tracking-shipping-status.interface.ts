import { TransactionTrackingAction } from '../transaction-tracking-action.interface';
import { TransactionTrackingAnimation } from '../transaction-tracking-animation.interface';

export interface TransactionTrackingShippingStatus {
  actions: TransactionTrackingAction[];
  animation: TransactionTrackingAnimation;
  description: string;
  title: string;
}
