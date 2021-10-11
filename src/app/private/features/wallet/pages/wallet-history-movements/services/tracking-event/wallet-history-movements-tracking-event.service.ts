import { Injectable } from '@angular/core';

import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewWalletMovementsHistory } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Injectable()
export class WalletHistoryMovementsTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

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
