import { TransactionTrackingInstructionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailModel,
  TransactionTrackingInstruction,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionModel implements TransactionTrackingInstruction {
  action?: TransactionTrackingActionDetail;
  description: string;

  constructor(instructionDto: TransactionTrackingInstructionDto) {
    if (!!instructionDto.action) {
      this.action = new TransactionTrackingActionDetailModel(instructionDto.action);
    }
    this.description = instructionDto.description;
  }
}
