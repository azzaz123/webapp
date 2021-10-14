import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ConfirmTransferBankAccount,
  SelectTransferAmount,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { WalletTransferTrackingEventService } from '@private/features/wallet/modals/transfer/services/wallet-transfer-tracking-event.service';

describe('WalletTransferTrackingEventService', () => {
  let service: WalletTransferTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletTransferTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(WalletTransferTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);

    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN user clicks over the select transfer amount button', () => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsEvent<SelectTransferAmount> = {
        name: ANALYTICS_EVENT_NAMES.SelectTransferAmount,
        eventType: ANALYTIC_EVENT_TYPES.UserPreference,
        attributes: {
          screenId: 236,
          balanceAmount: 13.13,
          transferAmount: 12.12,
        },
      };

      service.trackSelectTransferAmount(13.13, 12.12);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('WHEN user clicks over the confirm transfer bank acccount button', () => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsEvent<ConfirmTransferBankAccount> = {
        name: ANALYTICS_EVENT_NAMES.ConfirmTransferBankAccount,
        eventType: ANALYTIC_EVENT_TYPES.Transaction,
        attributes: {
          screenId: 237,
          balanceAmount: 13.13,
          transferAmount: 12.12,
        },
      };

      service.trackConfirmTransferBankAccount(13.13, 12.12);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
