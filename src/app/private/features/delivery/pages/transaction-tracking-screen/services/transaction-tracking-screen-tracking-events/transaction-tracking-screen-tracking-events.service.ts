import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickActionTappedTransactionalTimeline,
  SCREEN_IDS,
  ViewTransactionalTimeline,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ActionNameAnalytics } from './action-name-analytics-type';

@Injectable()
export class TransactionTrackingScreenTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewTTSScreen(requestId: string, buyerCountry: string, sellerCountry: string): void {
    const pageViewEvent: AnalyticsPageView<ViewTransactionalTimeline> = {
      name: ANALYTICS_EVENT_NAMES.ViewTransactionalTimeline,
      attributes: {
        screenId: SCREEN_IDS.ShippingTimeline,
        requestId,
        source: 'N/A',
        buyerCountry,
        sellerCountry,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickActionTTS(requestId: string, actionName: ActionNameAnalytics) {
    const event: AnalyticsEvent<ClickActionTappedTransactionalTimeline> = {
      name: ANALYTICS_EVENT_NAMES.ClickActionTappedTransactionalTimeline,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.ShippingTimeline,
        requestId,
        actionName,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
