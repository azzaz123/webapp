import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, ClickHelpWallet } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { WalletTrackingEventService } from '@private/features/wallet/services/tracking-event/wallet-tracking-event.service';

describe('WalletTrackingEventService', () => {
  let service: WalletTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(WalletTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);

    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN user clicks over the help link', () => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsEvent<ClickHelpWallet> = {
        name: ANALYTICS_EVENT_NAMES.ClickHelpWallet,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: 235,
        },
      };

      service.trackHelpWallet();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
