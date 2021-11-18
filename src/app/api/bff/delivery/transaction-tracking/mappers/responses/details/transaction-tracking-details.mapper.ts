import { ToDomainMapper } from '@api/core/utils/types';
import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDetailsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingDetailsModel } from '@api/core/model/delivery/transaction/tracking/models/transaction-tracking-details.model';

const emptyTransactionDetailsTracking: TransactionTrackingDetails = {
  info: undefined,
  item: undefined,
  title: undefined,
  user: undefined,
};
export const mapTransactionTrackingDetailsDtoTransactionTrackingDetails: ToDomainMapper<
  TransactionTrackingDetailsDto,
  TransactionTrackingDetails
> = (input: TransactionTrackingDetailsDto): TransactionTrackingDetails => {
  return !!input ? new TransactionTrackingDetailsModel(input) : emptyTransactionDetailsTracking;
};
