import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemWalletMovements,
  ViewWalletMovementsHistory,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { WalletHistoryMovementsTrackingEventService } from '@private/features/wallet/pages/wallet-history-movements/services/tracking-event/wallet-history-movements-tracking-event.service';

describe('WalletHistoryMovementsTrackingEventService', () => {
  let service: WalletHistoryMovementsTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletHistoryMovementsTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(WalletHistoryMovementsTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);

    spyOn(analyticsService, 'trackPageView');
    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe.each([
    [null, true],
    [0, true],
    [1, false],
  ])('WHEN user send the event', (historyListLength, expected) => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsPageView<ViewWalletMovementsHistory> = {
        name: 'View Wallet Movements History',
        attributes: {
          screenId: 254,
          emptyState: expected,
        },
      };

      service.trackViewWalletHistoryMovement(historyListLength);

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe.each([
    [WALLET_HISTORY_FILTERS.ALL, 254],
    [WALLET_HISTORY_FILTERS.IN, 255],
    [WALLET_HISTORY_FILTERS.OUT, 256],
  ])('WHEN user clicks over a historic element', (filter, id) => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsEvent<ClickItemWalletMovements> = {
        name: ANALYTICS_EVENT_NAMES.ClickItemWalletMovements,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: id as ClickItemWalletMovements['screenId'],
        },
      };

      service.trackClickItemWalletMovement(filter);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
