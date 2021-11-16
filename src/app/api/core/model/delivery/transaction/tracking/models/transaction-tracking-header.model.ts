import {
  TransactionTrackingAction,
  TransactionTrackingActionModel,
  TransactionTrackingHeader,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingHeaderModel implements TransactionTrackingHeader {
  detail: TransactionTrackingAction;
  title: string;

  constructor(transactionTrackingDto: TransactionTrackingDto) {
    this.detail = new TransactionTrackingActionModel(transactionTrackingDto.top_action);
    this.title = transactionTrackingDto.title;
  }
}
