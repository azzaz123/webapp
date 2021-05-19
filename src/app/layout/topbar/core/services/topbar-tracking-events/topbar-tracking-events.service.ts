import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  CancelSearch,
  ClickKeyboardSearchButton,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class TopbarTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickKeyboardSearchButtonEvent(searchText: string): void {
    const event: AnalyticsEvent<ClickKeyboardSearchButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickKeyboardSearchButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Search,
        searchText: searchText,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackCancelSearchEvent(searchText: string): void {
    const event: AnalyticsEvent<CancelSearch> = {
      name: ANALYTICS_EVENT_NAMES.CancelSearch,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Search,
        searchText: searchText,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
