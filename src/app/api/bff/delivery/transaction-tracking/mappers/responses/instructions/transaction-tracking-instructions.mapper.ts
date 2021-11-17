import { ToDomainMapper } from '@api/core/utils/types';
import { TransactionTrackingInstructionsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

const emptyTransactionInstructionsTracking: TransactionTrackingInstructions = {
  info: undefined,
  item: undefined,
  title: undefined,
  user: undefined,
};
export const mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions: ToDomainMapper<
  TransactionTrackingInstructionsDto,
  TransactionTrackingInstructions
> = (input: TransactionTrackingInstructionsDto): TransactionTrackingInstructions => {
  return !!input ? new TransactionTrackingInstructionsModel(input) : emptyTransactionInstructionsTracking;
};
