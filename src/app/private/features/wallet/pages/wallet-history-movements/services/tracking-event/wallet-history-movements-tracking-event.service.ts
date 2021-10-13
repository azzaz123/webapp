import { Injectable } from '@angular/core';

import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemWalletMovements,
  SCREEN_IDS,
  ViewWalletMovementsHistory,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class WalletHistoryMovementsTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickItemWalletMovement(): void {
    const event: AnalyticsEvent<ClickItemWalletMovements> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemWalletMovements,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.WalletMovementsHistory,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackViewWalletHistoryMovement(historyListLength: number): void {
    const event: AnalyticsPageView<ViewWalletMovementsHistory> = {
      name: ANALYTICS_EVENT_NAMES.ViewWalletMovementsHistory,
      attributes: {
        screenId: SCREEN_IDS.WalletMovementsHistory,
        emptyState: this.isEmpty(historyListLength),
      },
    };
    this.analyticsService.trackPageView(event);
  }

  private isEmpty(value: number): boolean {
    return !value ? true : value < 1;
  }
}
