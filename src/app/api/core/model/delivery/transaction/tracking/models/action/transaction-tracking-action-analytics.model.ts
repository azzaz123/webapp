import { TransactionTrackingActionDetailAnalytics as TransactionTrackingActionAnalytics } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailAnalyticsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';

export class TransactionTrackingActionAnalyticsModel implements TransactionTrackingActionAnalytics {
  public requestId: string;
  public source: string;
  public userId: string;

  constructor(actionDetailAnalyticsDto: TransactionTrackingActionDetailAnalyticsDto) {
    this.requestId = actionDetailAnalyticsDto.request_id;
    this.source = actionDetailAnalyticsDto.source;
    this.userId = actionDetailAnalyticsDto.user_id;
  }
}
