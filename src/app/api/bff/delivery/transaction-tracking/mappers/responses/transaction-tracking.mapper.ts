import { ToDomainMapper } from '@api/core/utils/types';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking/interfaces/transaction-tracking.interface';
import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingModel } from '@api/core/model/delivery/transaction/tracking/models/transaction-tracking.model';

const emptyTransactionTracking: TransactionTracking = {
  header: undefined,
  shippingStatus: undefined,
  statusInfo: undefined,
};
export const mapTransactionTrackingDtoTransactionTracking: ToDomainMapper<TransactionTrackingDto, TransactionTracking> = (
  input: TransactionTrackingDto
): TransactionTracking => {
  return !!input ? new TransactionTrackingModel(input) : emptyTransactionTracking;
};
