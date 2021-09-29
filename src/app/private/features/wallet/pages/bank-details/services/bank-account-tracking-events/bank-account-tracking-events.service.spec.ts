import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KYCPropertiesHttpService } from '@api/payments/kyc-properties/http/kyc-properties-http.service';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickAddEditBankAccount,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { of, throwError } from 'rxjs';
import { BankAccountTrackingEventTestCase, MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES } from './bank-account-tracking-events.fixtures.spec';

import { BankAccountTrackingEventsService } from './bank-account-tracking-events.service';

describe('BankAccountTrackingEventsService', () => {
  let service: BankAccountTrackingEventsService;
  let analyticsService: AnalyticsService;
  let kycPropertiesService: KYCPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BankAccountTrackingEventsService,
        KYCPropertiesHttpService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        KYCPropertiesService,
      ],
    });
    service = TestBed.inject(BankAccountTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
    kycPropertiesService = TestBed.inject(KYCPropertiesService);

    spyOn(analyticsService, 'trackEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe.each(MOCK_BANK_ACCOUNT_TRACKING_EVENTS_CASES)(
    'when tracking the event',
    (bankAccountTrackingEventCase: BankAccountTrackingEventTestCase) => {
      describe(`and when user clicked on ${bankAccountTrackingEventCase.isEdit ? 'edit' : 'add'} bank account with KYC status "${
        bankAccountTrackingEventCase.kycProperties
      }"`, () => {
        it('should ask the KYC status to the server', () => {
          const KYCProperties = jest
            .spyOn(kycPropertiesService, 'KYCProperties$', 'get')
            .mockReturnValue(of(bankAccountTrackingEventCase.kycProperties));

          service.trackClickAddEditBankAccount(bankAccountTrackingEventCase.isEdit);

          expect(KYCProperties).toHaveBeenCalledTimes(1);
        });

        it('should track the event to analytics', () => {
          jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(of(bankAccountTrackingEventCase.kycProperties));
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
    it('should ask the KYC status to the server', () => {
      const KYCProperties = jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(throwError('F in chat'));

      service.trackClickAddEditBankAccount(true);

      expect(KYCProperties).toHaveBeenCalledTimes(1);
    });

    it('should not track the event', () => {
      jest.spyOn(kycPropertiesService, 'KYCProperties$', 'get').mockReturnValue(throwError('F in chat'));

      expect(analyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });
});
