import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking/';
import { ToDomainMapper } from '@api/core/utils/types';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingDto } from '../../dtos/responses';

export const mapTransactionTrackingDtoTransactionTracking: ToDomainMapper<TransactionTrackingDto, TransactionTracking> = (
  input: TransactionTrackingDto
): TransactionTracking => {
  return MOCK_TRANSACTION_TRACKING;
};
