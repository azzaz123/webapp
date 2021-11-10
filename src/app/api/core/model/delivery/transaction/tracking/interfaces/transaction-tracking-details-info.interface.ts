import { TransactionTrackingDetailsInfoIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingActionDetail, TransactionTrackingStatusInfoIcon } from '..';

export interface TransactionTrackingDetailsInfo {
  icon: TransactionTrackingStatusInfoIcon;
  description: string;
  action_icon: TransactionTrackingDetailsInfoIconDto;
  action: TransactionTrackingActionDetail;
}
