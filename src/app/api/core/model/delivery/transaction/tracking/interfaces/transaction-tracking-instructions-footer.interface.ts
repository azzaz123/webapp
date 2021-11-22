import { TransactionTrackingAction } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingInstructionsFooter {
  actions: TransactionTrackingAction[];
  description: string;
}
