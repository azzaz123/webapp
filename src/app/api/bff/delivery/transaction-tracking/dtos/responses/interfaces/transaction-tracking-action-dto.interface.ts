import { TransactionTrackingActionStateDto } from '../types/transaction-tracking-action-state-dto.type';
import { TransactionTrackingActionStyleDto } from '../types/transaction-tracking-action-style-dto.type';
import { TransactionTrackingActionDetailDto } from './transaction-tracking-action-detail-dto.interface';

export interface TransactionTrackingActionDto {
  action: TransactionTrackingActionDetailDto;
  state: TransactionTrackingActionStateDto;
  style: TransactionTrackingActionStyleDto;
  title: string;
}
