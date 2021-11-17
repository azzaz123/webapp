import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionStateDto,
  TransactionTrackingActionStyleDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingActionDto {
  action: TransactionTrackingActionDetailDto;
  state: TransactionTrackingActionStateDto;
  style: TransactionTrackingActionStyleDto;
  title: string;
}
