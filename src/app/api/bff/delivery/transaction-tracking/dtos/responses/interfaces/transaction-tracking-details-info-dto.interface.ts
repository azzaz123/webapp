import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';

export interface TransactionTrackingDetailsInfoDto {
  icon: TransactionTrackingIconDto;
  description: string;
  action_icon: TransactionTrackingDetailsInfoIconDto;
  action: TransactionTrackingActionDetailDto;
}

export type TransactionTrackingDetailsInfoIconDto = 'caret' | 'none';
