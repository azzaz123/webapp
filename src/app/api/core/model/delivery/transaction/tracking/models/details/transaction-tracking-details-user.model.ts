import {
  TransactionTrackingDetailsUser,
  TransactionTrackingStatusInfoIcon,
  TransactionTrackingStatusInfoIconModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDetailsUserDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingDetailsUserModel implements TransactionTrackingDetailsUser {
  icon: TransactionTrackingStatusInfoIcon;

  constructor(transactionTrackingDetailsUserDto: TransactionTrackingDetailsUserDto) {
    this.icon = new TransactionTrackingStatusInfoIconModel(transactionTrackingDetailsUserDto.icon);
  }
}
