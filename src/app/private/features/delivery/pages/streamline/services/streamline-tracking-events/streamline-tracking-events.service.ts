import { Injectable } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewShippingTransactions } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class StreamlineTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewStreamlineScreen(): void {
    const event: AnalyticsPageView<ViewShippingTransactions> = {
      name: ANALYTICS_EVENT_NAMES.ViewShippingTransactions,
      attributes: {
        screenId: SCREEN_IDS.MyShippingTransactions,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
