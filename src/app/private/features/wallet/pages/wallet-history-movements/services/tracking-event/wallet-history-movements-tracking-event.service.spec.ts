import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AnalyticsPageView, ViewWalletMovementsHistory } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
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
});
