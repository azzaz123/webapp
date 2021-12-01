import { TransactionTrackingActionDto, TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingCta,
  TransactionTrackingCtaModel,
  TransactionTrackingInstructionsFooter,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionsFooterModel implements TransactionTrackingInstructionsFooter {
  actions: TransactionTrackingCta[];
  description: string;

  constructor(transactionTrackingInstructionsDto: TransactionTrackingInstructionsDto) {
    this.description = transactionTrackingInstructionsDto.caption;
    this.actions = this.getActions(transactionTrackingInstructionsDto.actions);
  }

  private getActions(transactionTrackingActionDtos: TransactionTrackingActionDto[]): TransactionTrackingCta[] {
    let actions: TransactionTrackingCta[] = [];
    transactionTrackingActionDtos.forEach((action) => {
      actions.push(new TransactionTrackingCtaModel(action));
    });
    return actions;
  }
}
