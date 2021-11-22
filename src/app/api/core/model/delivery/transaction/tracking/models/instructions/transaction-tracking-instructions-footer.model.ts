import { TransactionTrackingActionDto, TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingAction,
  TransactionTrackingActionModel,
  TransactionTrackingInstructionsFooter,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionsFooterModel implements TransactionTrackingInstructionsFooter {
  actions: TransactionTrackingAction[];
  description: string;

  constructor(transactionTrackingInstructionsDto: TransactionTrackingInstructionsDto) {
    this.description = transactionTrackingInstructionsDto.caption;
    this.actions = this.getActions(transactionTrackingInstructionsDto.actions);
  }

  private getActions(transactionTrackingActionDtos: TransactionTrackingActionDto[]): TransactionTrackingAction[] {
    let actions: TransactionTrackingAction[] = [];
    transactionTrackingActionDtos.forEach((action) => {
      actions.push(new TransactionTrackingActionModel(action));
    });
    return actions;
  }
}
