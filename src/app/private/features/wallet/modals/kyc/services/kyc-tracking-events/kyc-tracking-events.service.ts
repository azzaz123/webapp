import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
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

@Injectable()
export class KycTrackingEventsService {
  // MIRAR EVENTYPE
  constructor(private analyticsService: AnalyticsService) {}

  public trackViewKYCTutorialScreen(): void {
    const event: AnalyticsEvent<ViewKYCTutorialScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCTutorialScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCTutorial,
      },
    };
  }

  public trackClickKYCStartVerification(): void {
    const event: AnalyticsEvent<ClickKYCStartVerification> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCStartVerification,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCTutorial,
      },
    };
  }

  public trackViewKYCBankAccountInfoScreen(): void {
    const event: AnalyticsEvent<ViewKYCBankAccountInfoScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCBankAccountInfoScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCBankAccountInfo,
      },
    };
  }

  public trackClickKYCConfirmBankAccountInfo(): void {
    const event: AnalyticsEvent<ClickKYCConfirmBankAccountInfo> = {
      name: ANALYTICS_EVENT_NAMES.ClickKYCConfirmBankAccountInfo,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCBankAccountInfo,
      },
    };
  }

  public trackViewKYCIdentityVerificationScreen(): void {
    const event: AnalyticsEvent<ViewKYCIdentityVerificationScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCIdentityVerificationScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCIdentityVerification,
      },
    };
  }

  public trackViewKYCUploadIdentityVerificationScreen(nationality): void {
    const event: AnalyticsEvent<ViewKYCUploadIdentityVerificationScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCUploadIdentityVerificationScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCUploadIdentityVerification,
        nationality,
      },
    };
  }

  public trackViewKYCDocumentationTypeScreen(typeOfDocument): void {
    const event: AnalyticsEvent<ViewKYCDocumentationTypeScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCDocumentationTypeScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCDocumentationType,
        typeOfDocument,
      },
    };
  }

  public trackViewKYCReviewDocumentationImageScreen(typeOfDocument): void {
    const event: AnalyticsEvent<ViewKYCReviewDocumentationImageScreen> = {
      name: ANALYTICS_EVENT_NAMES.ViewKYCReviewDocumentationImageScreen,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.KYCReviewDocumentationImage,
        typeOfDocument,
      },
    };
  }

  public trackClickKYCFinishIdentityVerification(): void {
    const event: AnalyticsEvent<ClickKYCFinishIdentityVerification> = null;
  }

  public trackViewKYCVerifyingIdentityScreen(): void {
    const event: AnalyticsEvent<ViewKYCVerifyingIdentityScreen> = null;
  }
}
