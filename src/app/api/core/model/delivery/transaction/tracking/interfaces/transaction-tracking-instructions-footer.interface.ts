import { TransactionTrackingCta } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingInstructionsFooter {
  actions: TransactionTrackingCta[];
  description: string;
}
