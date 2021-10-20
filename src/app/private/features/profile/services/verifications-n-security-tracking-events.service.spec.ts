import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickVerificationOption,
  SCREEN_IDS,
  StartVerificationProcess,
  ViewVerificationsAndSecurityScreen,
} from '@core/analytics/analytics-constants';
import { VerificationsNSecurityTrackingEventsService } from './verifications-n-security-tracking-events.service';
import { MOCK_USER_VERIFICATIONS_MAPPED } from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { VERIFICATION_METHOD } from '@api/core/model/verifications';

describe('VerificationsNSecurityTrackingEventsService', () => {
  let service: VerificationsNSecurityTrackingEventsService;
  let analyticsService: AnalyticsService;
  let userVerificationsMock = MOCK_USER_VERIFICATIONS_MAPPED;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [VerificationsNSecurityTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(VerificationsNSecurityTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  describe('when verifications & security page is loaded', () => {
    beforeEach(() => {
      spyOn(service, 'verificationsNSecurityPageView').and.callThrough();
      spyOn(analyticsService, 'trackPageView');
    });

    it('should track the page view', fakeAsync(() => {
      service.verificationsNSecurityPageView(userVerificationsMock);

      const MOCK_PAGE_VIEW: AnalyticsPageView<ViewVerificationsAndSecurityScreen> = {
        name: ANALYTICS_EVENT_NAMES.ViewVerificationsandSecurityScreen,
        attributes: {
          screenId: SCREEN_IDS.VerificationsAndSecurityScreen,
          emailVerified: userVerificationsMock.email,
          phoneVerified: userVerificationsMock.phone,
          facebookVerified: userVerificationsMock.facebook,
        },
      };

      tick();

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_PAGE_VIEW);
    }));

    describe('when user clicks on verify email | phone option', () => {
      beforeEach(() => {
        spyOn(service, 'trackClickVerificationOptionEvent').and.callThrough();
        spyOn(analyticsService, 'trackEvent');
      });

      it('should track click verification option event', fakeAsync(() => {
        service.trackClickVerificationOptionEvent(VERIFICATION_METHOD.EMAIL);

        const MOCK_EVENT: AnalyticsEvent<ClickVerificationOption> = {
          name: ANALYTICS_EVENT_NAMES.ClickVerificationOption,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.VerificationsAndSecurityScreen,
            verificationMethod: VERIFICATION_METHOD.EMAIL,
          },
        };

        tick();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EVENT);
      }));
    });

    describe('when user clicks on the button to start the email verification', () => {
      beforeEach(() => {
        spyOn(service, 'trackStartEmailVerificationProcessEvent').and.callThrough();
        spyOn(analyticsService, 'trackEvent');
      });

      it('should track email verification process event', fakeAsync(() => {
        service.trackStartEmailVerificationProcessEvent();

        const MOCK_EVENT: AnalyticsEvent<StartVerificationProcess> = {
          name: ANALYTICS_EVENT_NAMES.StartVerificationProcess,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.EmailVerificationScreen,
            verificationMethod: VERIFICATION_METHOD.EMAIL,
          },
        };

        tick();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EVENT);
      }));
    });

    describe('when user clicks on the button to start the phone verification', () => {
      beforeEach(() => {
        spyOn(service, 'trackStartPhoneVerificationProcessEvent').and.callThrough();
        spyOn(analyticsService, 'trackEvent');
      });

      it('should track phone verification process event', fakeAsync(() => {
        service.trackStartPhoneVerificationProcessEvent();

        const MOCK_EVENT: AnalyticsEvent<StartVerificationProcess> = {
          name: ANALYTICS_EVENT_NAMES.StartVerificationProcess,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.PhoneVerificationScreen,
            verificationMethod: VERIFICATION_METHOD.PHONE,
          },
        };

        tick();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_EVENT);
      }));
    });
  });
});
