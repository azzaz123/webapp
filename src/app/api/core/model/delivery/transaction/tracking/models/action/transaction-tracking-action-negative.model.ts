import { TransactionTrackingActionNegative } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingActionNegativeModel implements TransactionTrackingActionNegative {
  public title: string;

  constructor(title: string) {
    this.title = title;
  }
}
