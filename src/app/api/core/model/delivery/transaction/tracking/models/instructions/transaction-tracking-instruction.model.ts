import { TransactionTrackingInstructionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionFactory,
  TransactionTrackingInstruction,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionModel implements TransactionTrackingInstruction {
  action?: TransactionTrackingActionDetail;
  description: string;

  constructor(instructionDto: TransactionTrackingInstructionDto) {
    if (!!instructionDto.action) {
      this.action = new TransactionTrackingActionFactory(instructionDto.action).getAction();
    }
    this.description = instructionDto.description;
  }
}
