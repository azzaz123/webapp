import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickHelpWallet,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class WalletTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackHelpWallet(): void {
    const event: AnalyticsEvent<ClickHelpWallet> = {
      name: ANALYTICS_EVENT_NAMES.ClickHelpWallet,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyWallet,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
