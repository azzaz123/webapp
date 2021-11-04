import { TransactionTrackingAction } from '../transaction-tracking-action.interface';
import { TransactionTrackingState } from '../transaction-tracking-state.interface';
import { TransactionTrackingStyle } from '../transaction-tracking-style.interface';

export interface TransactionTrackingHeader {
  action: TransactionTrackingAction;
  state: TransactionTrackingState;
  style: TransactionTrackingStyle;
  title: string;
}
