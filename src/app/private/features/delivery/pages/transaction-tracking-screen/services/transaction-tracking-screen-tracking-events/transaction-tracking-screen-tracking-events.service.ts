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

export type ActionNameAnalytics = 'Help General Doubts' | 'Help Packet On Hold' | 'Help Packet Delivered' | 'Tracer';
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
