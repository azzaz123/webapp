import { TransactionTrackingActionDetail } from './transaction-tracking-action-detail.interface';
import { TransactionTrackingState } from './transaction-tracking-state.interface';
import { TransactionTrackingStyle } from './transaction-tracking-style.interface';

export interface TransactionTrackingCta {
  action: TransactionTrackingActionDetail;
  state: TransactionTrackingState;
  style: TransactionTrackingStyle;
  title: string;
}
