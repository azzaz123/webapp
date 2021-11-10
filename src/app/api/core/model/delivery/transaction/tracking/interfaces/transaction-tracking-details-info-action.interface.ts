import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDetailsInfoIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingDetailsInfoAction extends TransactionTrackingActionDetail {
  icon: TransactionTrackingDetailsInfoIconDto;
}
