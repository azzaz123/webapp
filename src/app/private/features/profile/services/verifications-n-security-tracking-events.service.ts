import { Injectable } from '@angular/core';
import { UserVerifications, VERIFICATION_METHOD } from '@api/core/model/verifications';
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
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class VerificationsNSecurityTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public verificationsNSecurityPageView(userVerifications$: Observable<UserVerifications>): void {
    userVerifications$.pipe(take(1)).subscribe((response: UserVerifications) => this.trackOpenVerificationsNSecurity(response));
  }

  public trackClickVerificationOptionEvent(verificationMethod: VERIFICATION_METHOD): void {
    const event: AnalyticsEvent<ClickVerificationOption> = {
      name: ANALYTICS_EVENT_NAMES.ClickVerificationOption,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.VerificationsAndSecurityScreen,
        verificationMethod,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackStartEmailVerificationProcessEvent(): void {
    this.trackStartVerificationProcessEvent(VERIFICATION_METHOD.EMAIL, SCREEN_IDS.EmailVerificationScreen);
  }

  public trackStartPhoneVerificationProcessEvent(): void {
    this.trackStartVerificationProcessEvent(VERIFICATION_METHOD.PHONE, SCREEN_IDS.PhoneVerificationScreen);
  }

  private trackOpenVerificationsNSecurity(userVerifications: UserVerifications): void {
    const { email, phone, facebook } = userVerifications;

    const event: AnalyticsPageView<ViewVerificationsAndSecurityScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewVerificationsandSecurityScreen,
      attributes: {
        screenId: SCREEN_IDS.VerificationsAndSecurityScreen,
        emailVerified: email,
        phoneVerified: phone,
        facebookVerified: facebook,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private trackStartVerificationProcessEvent(verificationMethod: VERIFICATION_METHOD, screenId: SCREEN_IDS): void {
    const event: AnalyticsEvent<StartVerificationProcess> = {
      name: ANALYTICS_EVENT_NAMES.StartVerificationProcess,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: screenId as StartVerificationProcess['screenId'],
        verificationMethod,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
