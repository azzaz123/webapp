import { TransactionTrackingIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';
import { TransactionTrackingInstructionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingDetailsInfoDto extends TransactionTrackingInstructionDto {
  icon: TransactionTrackingIconDto;
  action_icon: TransactionTrackingDetailsInfoIconDto;
}

export type TransactionTrackingDetailsInfoIconDto = 'caret' | 'none';
