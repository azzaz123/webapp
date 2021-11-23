import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickTransferBankAccount,
  ViewWallet,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { MOCK_KYC_NO_NEED_PROPERTIES } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockPaymentsWalletsService } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/wallet-balance-tracking-event.service';

import { of } from 'rxjs';

describe('WalletBalanceTrackingEventService', () => {
  let service: WalletBalanceTrackingEventService;
  let analyticsService: AnalyticsService;
  let kycPropertiesService: KYCPropertiesService;
  let paymentsWalletService: PaymentsWalletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WalletBalanceTrackingEventService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: PaymentsWalletsService, useClass: MockPaymentsWalletsService },
        {
          provide: KYCPropertiesService,
          useValue: {
            get KYCProperties$() {
              return of(MOCK_KYC_NO_NEED_PROPERTIES);
            },
          },
        },
      ],
    });
    service = TestBed.inject(WalletBalanceTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
    kycPropertiesService = TestBed.inject(KYCPropertiesService);
    paymentsWalletService = TestBed.inject(PaymentsWalletsService);

    spyOn(analyticsService, 'trackPageView');
    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN user clicks over the transfer to bank account button', () => {
    it('should track the event', () => {
      const expectedEvent: AnalyticsEvent<ClickTransferBankAccount> = {
        name: ANALYTICS_EVENT_NAMES.ClickTransferBankAccount,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: 235,
          balanceAmount: 13.13,
        },
      };

      service.trackClickTransferBankAccount(13.13);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe.each([
    [KYC_STATUS.NO_NEED, 'verified'],
    [KYC_STATUS.PENDING, 'pending'],
    [KYC_STATUS.PENDING_VERIFICATION, 'inProgress'],
    [KYC_STATUS.REJECTED, 'pending'],
    [KYC_STATUS.VERIFIED, 'verified'],
  ])('WHEN user send the event', (originalStatus, mappedStatus) => {
    let kycPropertiesSpy;

    beforeEach(() => {
      kycPropertiesSpy = jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(
        of({
          inflowStatus: null,
          outflowStatus: null,
          refusedReason: null,
          status: originalStatus,
        })
      );
    });
    it('should track the mapped status', () => {
      const expectedEvent: AnalyticsPageView<ViewWallet> = {
        name: 'View Wallet',
        attributes: {
          screenId: 235,
          kycStatus: mappedStatus as 'verified' | 'pending' | 'inProgress',
          balanceAmount: 1722.41,
        },
      };

      service.trackViewWallet();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
    });

    it('should call to the payments service', () => {
      const walletBalanceSpy = jest.spyOn(paymentsWalletService, 'walletBalance$', 'get').mockReturnValue(of(null));

      service.trackViewWallet();

      expect(walletBalanceSpy).toHaveBeenCalledTimes(1);
    });

    it('should call to the kyc service', () => {
      jest.spyOn(paymentsWalletService, 'walletBalance$', 'get').mockReturnValue(of(null));

      service.trackViewWallet();

      expect(kycPropertiesSpy).toHaveBeenCalledTimes(1);
    });

    describe('AND WHEN they do not receive any balance', () => {
      beforeEach(() => {
        jest.spyOn(paymentsWalletService, 'walletBalance$', 'get').mockReturnValue(of(null));
      });

      it('should track the event', () => {
        const expectedEvent: AnalyticsPageView<ViewWallet> = {
          name: 'View Wallet',
          attributes: {
            screenId: 235,
            kycStatus: mappedStatus as 'verified' | 'pending' | 'inProgress',
            balanceAmount: undefined,
          },
        };

        service.trackViewWallet();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      });
    });
  });
});
