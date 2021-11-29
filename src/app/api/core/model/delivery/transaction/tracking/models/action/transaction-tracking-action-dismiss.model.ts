import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDetailAnalytics,
  TransactionTrackingActionDismiss,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionDismissModel implements TransactionTrackingActionDismiss {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isDismiss: boolean = true;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto?.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
  }
}
