import { Injectable } from '@angular/core';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';

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
import { InnerType } from '@api/core/utils/types';

const WalletHistoryFilterToEventAttribute: Partial<Record<WALLET_HISTORY_FILTERS, ScreenIdEventAttribute>> = {
  [WALLET_HISTORY_FILTERS.ALL]: SCREEN_IDS.WalletMovementsHistory,
  [WALLET_HISTORY_FILTERS.IN]: SCREEN_IDS.WalletIncomingMovementsHistory,
  [WALLET_HISTORY_FILTERS.OUT]: SCREEN_IDS.WalletOutgoingMovementsHistory,
};

type ScreenIdEventAttribute = InnerType<ClickItemWalletMovements, 'screenId'> | undefined;

@Injectable()
export class WalletHistoryMovementsTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickItemWalletMovement(filter: WALLET_HISTORY_FILTERS): void {
    const event: AnalyticsEvent<ClickItemWalletMovements> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemWalletMovements,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: this.mapWalletHistoryFilterToScreenIdAtribute(filter),
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

  private mapWalletHistoryFilterToScreenIdAtribute(filter: WALLET_HISTORY_FILTERS): ScreenIdEventAttribute {
    return WalletHistoryFilterToEventAttribute[filter];
  }
}
