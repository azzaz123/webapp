import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking/';
import { TransactionTrackingModel } from '@api/core/model/delivery/transaction/tracking/models/transaction-tracking.model';
import { ToDomainMapper } from '@api/core/utils/types';
import { TransactionTrackingDto } from '../../dtos/responses';

export const mapTransactionTrackingDtoTransactionTracking: ToDomainMapper<TransactionTrackingDto, TransactionTracking> = (
  input: TransactionTrackingDto
): TransactionTracking => {
  return new TransactionTrackingModel(input);
};
