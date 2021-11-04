import { TransactionTrackingActionAnalyticsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionAnalytics } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingActionAnalyticsModel implements TransactionTrackingActionAnalytics {
  requestId: string;
  source: string;
  userId: string;

  constructor(actionAnalyticsDto: TransactionTrackingActionAnalyticsDto) {
    this.requestId = actionAnalyticsDto.request_id;
    this.source = actionAnalyticsDto.source;
    this.userId = actionAnalyticsDto.user_id;
  }
}
