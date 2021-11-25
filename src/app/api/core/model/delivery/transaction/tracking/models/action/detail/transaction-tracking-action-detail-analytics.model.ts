import { TransactionTrackingActionDetailAnalyticsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionDetailAnalytics as TransactionTrackingActionAnalytics } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingActionAnalyticsModel implements TransactionTrackingActionAnalytics {
  requestId: string;
  source: string;
  userId: string;

  constructor(actionDetailAnalyticsDto: TransactionTrackingActionDetailAnalyticsDto) {
    this.requestId = actionDetailAnalyticsDto.request_id;
    this.source = actionDetailAnalyticsDto.source;
    this.userId = actionDetailAnalyticsDto.user_id;
  }
}
