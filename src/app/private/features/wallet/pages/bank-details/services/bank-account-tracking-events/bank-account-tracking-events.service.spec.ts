import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAddEditBankAccount,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { KYCBannerApiService } from '@private/features/wallet/services/api/kyc-banner-api.service';
import { of, throwError } from 'rxjs';
import { BankAccountTrackingEventTestCase, MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES } from './bank-account-tracking-events.fixtures.spec';

import { BankAccountTrackingEventsService } from './bank-account-tracking-events.service';

describe('BankAccountTrackingEventsService', () => {
  let service: BankAccountTrackingEventsService;
  let analyticsService: AnalyticsService;
  let kycBannerStatusService: KYCBannerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankAccountTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }, KYCBannerApiService],
    });
    service = TestBed.inject(BankAccountTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
    kycBannerStatusService = TestBed.inject(KYCBannerApiService);

    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe.each(MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES)(
    'when tracking the event',
    (bankAccountTrackingEventCase: BankAccountTrackingEventTestCase) => {
      describe(`and when user clicked on ${bankAccountTrackingEventCase.isEdit ? 'edit' : 'add'} bank account with KYC status "${
        bankAccountTrackingEventCase.kycBannerStatus
      }"`, () => {
        beforeEach(() => {
          spyOn(kycBannerStatusService, 'getKYCBanner').and.returnValue(of({ status: bankAccountTrackingEventCase.kycBannerStatus }));
        });

        it('should ask the KYC status to the server', () => {
          service.trackClickAddEditBankAccount(bankAccountTrackingEventCase.isEdit);

          expect(kycBannerStatusService.getKYCBanner).toHaveBeenCalledTimes(1);
        });

        it('should track the event to analytics', () => {
          const addOrEdit = bankAccountTrackingEventCase.mappedAddOrEditToAnalytics;
          const kycStatus = bankAccountTrackingEventCase.mappedBannerStatusToAnalytics;
          const expectedEvent: AnalyticsEvent<ClickAddEditBankAccount> = {
            name: ANALYTICS_EVENT_NAMES.ClickAddEditBankAccount,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              screenId: SCREEN_IDS.MyBankDetails,
              addOrEdit,
              kycStatus,
            },
          };

          service.trackClickAddEditBankAccount(bankAccountTrackingEventCase.isEdit);

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    }
  );

  describe('when KYC status server gives an error', () => {
    beforeEach(() => spyOn(kycBannerStatusService, 'getKYCBanner').and.returnValue(throwError('F in chat')));

    it('should ask the KYC status to the server', () => {
      service.trackClickAddEditBankAccount(true);

      expect(kycBannerStatusService.getKYCBanner).toHaveBeenCalledTimes(1);
    });

    it('should not track the event', () => {
      expect(analyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });
});
