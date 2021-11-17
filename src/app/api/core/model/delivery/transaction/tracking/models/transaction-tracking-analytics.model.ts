import { TransactionTrackingAnalytics, TransactionTrackingAnalyticsUserProperties } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingAnalyticsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-analytics-dto.interface';

export class TransactionTrackingAnalyticsModel implements TransactionTrackingAnalytics {
  buyer: TransactionTrackingAnalyticsUserProperties;
  seller: TransactionTrackingAnalyticsUserProperties;

  constructor(analyticsDto: TransactionTrackingAnalyticsDto) {
    this.buyer = this.getUserProperties(analyticsDto.buyer_country);
    this.seller = this.getUserProperties(analyticsDto.seller_country);
  }

  private getUserProperties(countryDto: string): TransactionTrackingAnalyticsUserProperties {
    return {
      country: countryDto,
    };
  }
}
