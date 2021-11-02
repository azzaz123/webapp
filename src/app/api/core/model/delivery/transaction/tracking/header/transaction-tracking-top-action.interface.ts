import { TransactionTrackingAction } from '../transaction-tracking-action.interface';

export interface TransactionTrackingTopAction {
  title: string;
  action: TransactionTrackingAction;
}
