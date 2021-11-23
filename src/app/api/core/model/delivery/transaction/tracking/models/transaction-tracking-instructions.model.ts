import { TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingHeader,
  TransactionTrackingHeaderModel,
  TransactionTrackingInstructions,
  TransactionTrackingInstructionsBody,
  TransactionTrackingInstructionsBodyModel,
  TransactionTrackingInstructionsFooter,
  TransactionTrackingInstructionsFooterModel,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionsModel implements TransactionTrackingInstructions {
  body: TransactionTrackingInstructionsBody;
  footer: TransactionTrackingInstructionsFooter;
  header: TransactionTrackingHeader;

  constructor(transactionTrackingInstructionsDto: TransactionTrackingInstructionsDto) {
    this.body = new TransactionTrackingInstructionsBodyModel(transactionTrackingInstructionsDto);
    this.footer = new TransactionTrackingInstructionsFooterModel(transactionTrackingInstructionsDto);
    this.header = new TransactionTrackingHeaderModel(null, transactionTrackingInstructionsDto.navigation_title);
  }
}
