import { ToDomainMapper } from '@api/core/utils/types';
import { TransactionTrackingInstructions, TransactionTrackingInstructionsModel } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

const emptyTransactionInstructionsTracking: TransactionTrackingInstructions = {
  body: undefined,
  footer: undefined,
  header: undefined,
};
export const mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions: ToDomainMapper<
  TransactionTrackingInstructionsDto,
  TransactionTrackingInstructions
> = (input: TransactionTrackingInstructionsDto): TransactionTrackingInstructions => {
  return !!input ? new TransactionTrackingInstructionsModel(input) : emptyTransactionInstructionsTracking;
};
