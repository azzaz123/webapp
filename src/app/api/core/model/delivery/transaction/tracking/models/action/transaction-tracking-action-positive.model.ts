import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionFactory,
  TransactionTrackingActionNegativeModel,
  TransactionTrackingActionPositive,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';

export class TransactionTrackingActionPositiveModel
  extends TransactionTrackingActionNegativeModel
  implements TransactionTrackingActionPositive
{
  public action: TransactionTrackingActionDetail;
  public title: string;

  constructor(title: string, action: TransactionTrackingActionDetailDto) {
    super(title);
    if (!!action) {
      this.action = new TransactionTrackingActionFactory(action).getAction();
    }
  }
}
