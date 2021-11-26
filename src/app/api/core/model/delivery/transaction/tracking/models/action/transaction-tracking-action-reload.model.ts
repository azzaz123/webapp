import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDetailAnalytics,
  TransactionTrackingActionReload,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionReloadModel implements TransactionTrackingActionReload {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isReload: boolean = true;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
  }
}
