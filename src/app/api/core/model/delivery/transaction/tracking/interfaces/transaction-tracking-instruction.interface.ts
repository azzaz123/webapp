import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingInstruction {
  action?: TransactionTrackingActionDetail;
  description: string;
}
