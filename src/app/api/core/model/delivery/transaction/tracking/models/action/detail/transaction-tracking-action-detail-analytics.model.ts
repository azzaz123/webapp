import { TransactionTrackingActionDetailAnalyticsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionDetailAnalytics } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingActionDetailAnalyticsModel implements TransactionTrackingActionDetailAnalytics {
  requestId: string;
  source: string;
  userId: string;

  constructor(actionDetailAnalyticsDto: TransactionTrackingActionDetailAnalyticsDto) {
    this.requestId = actionDetailAnalyticsDto.request_id;
    this.source = actionDetailAnalyticsDto.source;
    this.userId = actionDetailAnalyticsDto.user_id;
  }
}
