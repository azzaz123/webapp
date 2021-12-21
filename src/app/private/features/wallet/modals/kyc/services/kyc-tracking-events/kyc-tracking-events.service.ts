import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickKYCConfirmBankAccountInfo,
  ClickKYCFinishIdentityVerification,
  ClickKYCStartVerification,
  SCREEN_IDS,
  ViewKYCBankAccountInfoScreen,
  ViewKYCDocumentationTypeScreen,
  ViewKYCIdentityVerificationScreen,
  ViewKYCReviewDocumentationImageScreen,
  ViewKYCTutorialScreen,
  ViewKYCUploadIdentityVerificationScreen,
  ViewKYCVerifyingIdentityScreen,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ClickKYCSelectImageMethod } from '@core/analytics/resources/events-interfaces/click-kyc-select-image-method.interface';
import { KYC_TAKE_IMAGE_OPTIONS } from '../../components/kyc-image-options/kyc-image-options.enum';
import { KYCNationalityAnalytics, KYCTypeOfDocumentAnalytics } from './kyc-tracking-events.type';

@Injectable()
export class KYCTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewKYCTutorialScreen(): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCTutorialScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCTutorialScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCTutorial,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickKYCStartVerification(): void {
    const event: AnalyticsEvent<ClickKYCStartVerification> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCStartVerification,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.KYCTutorial,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackViewKYCBankAccountInfoScreen(): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCBankAccountInfoScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCBankAccountInfoScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCBankAccountInfo,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickKYCConfirmBankAccountInfo(): void {
    const event: AnalyticsEvent<ClickKYCConfirmBankAccountInfo> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCConfirmBankAccountInfo,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.KYCBankAccountInfo,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackViewKYCIdentityVerificationScreen(): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCIdentityVerificationScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCIdentityVerificationScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCIdentityVerification,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackViewKYCUploadIdentityVerificationScreen(nationality: KYCNationalityAnalytics): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCUploadIdentityVerificationScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCUploadIdentityVerificationScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCUploadIdentityVerification,
        nationality,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackViewKYCDocumentationTypeScreen(typeOfDocument: KYCTypeOfDocumentAnalytics): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCDocumentationTypeScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCDocumentationTypeScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCDocumentationType,
        typeOfDocument,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackViewKYCReviewDocumentationImageScreen(typeOfDocument: KYCTypeOfDocumentAnalytics): void {
    const pageViewEvent: AnalyticsPageView<ViewKYCReviewDocumentationImageScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCReviewDocumentationImageScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCReviewDocumentationImage,
        typeOfDocument,
      },
    };

    this.analyticsService.trackPageView(pageViewEvent);
  }

  public trackClickKYCFinishIdentityVerification(typeOfDocument: KYCTypeOfDocumentAnalytics): void {
    const event: AnalyticsEvent<ClickKYCFinishIdentityVerification> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCFinishIdentityVerification,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.KYCReviewDocumentationImage,
        typeOfDocument,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackViewKYCVerifyingIdentityScreen(): void {
    const event: AnalyticsPageView<ViewKYCVerifyingIdentityScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCVerifyingIdentityScreen,
      attributes: {
        screenId: SCREEN_IDS.KYCVerifyingIdentity,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  public trackClickKycSelectImageMethod(imageMethod: KYC_TAKE_IMAGE_OPTIONS): void {
    const method: ClickKYCSelectImageMethod['method'] = imageMethod === KYC_TAKE_IMAGE_OPTIONS.SHOOT ? 'camera' : 'upload';

    const event: AnalyticsEvent<ClickKYCSelectImageMethod> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCSelectImageMethod,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.KYCSelectImage,
        method,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
