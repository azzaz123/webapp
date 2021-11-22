import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingInstructionDto {
  action: TransactionTrackingActionDetailDto;
  description: string;
}
