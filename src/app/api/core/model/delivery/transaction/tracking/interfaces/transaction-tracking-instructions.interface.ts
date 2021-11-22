import {
  TransactionTrackingHeader,
  TransactionTrackingInstructionsBody,
  TransactionTrackingInstructionsFooter,
} from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingInstructions {
  body: TransactionTrackingInstructionsBody;
  footer: TransactionTrackingInstructionsFooter;
  header: TransactionTrackingHeader;
}
