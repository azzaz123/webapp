import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AnalyticsPageView, ViewWallet } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/wallet-balance-tracking-event.service';

import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';

describe('WalletBalanceTrackingEventService', () => {
  let service: WalletBalanceTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletBalanceTrackingEventService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(WalletBalanceTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);

    spyOn(analyticsService, 'trackPageView');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe.each([
    [KYC_STATUS.NO_NEED, 'verified'],
    [KYC_STATUS.PENDING, 'pending'],
    [KYC_STATUS.PENDING_VERIFICATION, 'inProgress'],
    [KYC_STATUS.REJECTED, 'pending'],
    [KYC_STATUS.VERIFIED, 'verified'],
  ])('WHEN user send the event', (originalStatus, mappedStatus) => {
    it('should track the mapped status', () => {
      const expectedEvent: AnalyticsPageView<ViewWallet> = {
        name: 'View Wallet',
        attributes: {
          screenId: 235,
          kycStatus: mappedStatus as 'verified' | 'pending' | 'inProgress',
          balanceAmount: 13.13,
        },
      };

      service.trackViewWallet(13.13, originalStatus);

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
