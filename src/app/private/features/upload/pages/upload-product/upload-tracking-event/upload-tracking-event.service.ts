import { Injectable } from '@angular/core';
import {
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  ClickHelpTransactional,
  AnalyticsEvent,
  ANALYTIC_EVENT_TYPES,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class UploadTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickHelpTransactionalEvent(categoryId: number, sellerUserId: string, itemPrice: number, itemId?: string): void {
    const event: AnalyticsEvent<ClickHelpTransactional> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpTransactional,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        categoryId,
        sellerUserId,
        itemId,
        itemPrice,
        helpName: 'Help Shipping Upload Screen',
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
