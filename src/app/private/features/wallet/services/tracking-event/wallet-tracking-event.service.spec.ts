import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickBankDetails,
  ClickHelpWallet,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  BankAccountTrackingEventTestCase,
  MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES,
} from '@private/features/wallet/pages/bank-details/services/bank-account-tracking-events/bank-account-tracking-events.fixtures.spec';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { WalletTrackingEventService } from '@private/features/wallet/services/tracking-event/wallet-tracking-event.service';

import { of } from 'rxjs';

describe('WalletTrackingEventService', () => {
  let service: WalletTrackingEventService;
  let analyticsService: AnalyticsService;
  let kycPropertiesService: KYCPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        KYCPropertiesHttpService,
        KYCPropertiesService,
        WalletTrackingEventService,
      ],
    });
    service = TestBed.inject(WalletTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
    kycPropertiesService = TestBed.inject(KYCPropertiesService);

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

      service.trackClickHelpWallet();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe.each(MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES)(
    'when tracking the event',
    (bankAccountTrackingEventCase: BankAccountTrackingEventTestCase) => {
      describe(`AND WHEN user clicked on bank account details"${bankAccountTrackingEventCase.kycProperties}"`, () => {
        it('should ask the KYC status to the server', () => {
          const KYCProperties = jest
            .spyOn(kycPropertiesService, 'KYCProperties$', 'get')
            .mockReturnValue(of(bankAccountTrackingEventCase.kycProperties));

          service.trackClickBankDetails();

          expect(KYCProperties).toHaveBeenCalledTimes(1);
        });

        it('should track the event to analytics', () => {
          jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(bankAccountTrackingEventCase.kycProperties));
          const kycStatus = bankAccountTrackingEventCase.mappedBannerStatusToAnalytics;
          const expectedEvent: AnalyticsEvent<ClickBankDetails> = {
            name: ANALYTICS_EVENT_NAMES.ClickBankDetails,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyWallet,
              kycStatus,
            },
          };

          service.trackClickBankDetails();

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    }
  );
});
