import { Injectable } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewTransactionalTimeline } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class TransactionTrackingScreenTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewTTSScreen(requestId: string): void {
    const pageViewEvent: AnalyticsPageView<ViewTransactionalTimeline> = {
      name: ANALYTICS_EVENT_NAMES.ViewTransactionalTimeline,
      attributes: {
        screenId: SCREEN_IDS.ShippingTimeline,
        requestId,
        source: 'N/A',
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }
}
