import { TransactionTrackingActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingCta,
  TransactionTrackingActionModel,
  TransactionTrackingHeader,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingHeaderModel implements TransactionTrackingHeader {
  detail: TransactionTrackingCta;
  title: string;

  constructor(action: TransactionTrackingActionDto, title: string) {
    if (!!action) {
      this.detail = new TransactionTrackingActionModel(action);
    }
    this.title = title;
  }
}
