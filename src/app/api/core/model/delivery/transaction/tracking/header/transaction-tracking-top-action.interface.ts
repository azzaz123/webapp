import { TransactionTrackingAction } from '../transaction-tracking-action.interface';
import { TransactionTrackingActionState } from '../transaction-tracking-action-state.type';
import { TransactionTrackingActionStyle } from '../transaction-tracking-action-style.type';

export interface TransactionTrackingTopAction {
  action: TransactionTrackingAction;
  state: TransactionTrackingActionState;
  style: TransactionTrackingActionStyle;
  title: string;
}
