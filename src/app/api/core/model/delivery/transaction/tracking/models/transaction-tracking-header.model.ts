import { TransactionTrackingActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingAction,
  TransactionTrackingActionModel,
  TransactionTrackingHeader,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingHeaderModel implements TransactionTrackingHeader {
  detail: TransactionTrackingAction;
  title: string;

  constructor(action: TransactionTrackingActionDto, title: string) {
    if (!!action) {
      this.detail = new TransactionTrackingActionModel(action);
    }
    this.title = title;
  }
}
