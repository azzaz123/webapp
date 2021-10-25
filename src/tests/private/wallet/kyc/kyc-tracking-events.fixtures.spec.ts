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

export const MOCK_VIEW_KYC_TUTORIAL_SCREEN_EVENT: AnalyticsPageView<ViewKYCTutorialScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCTutorialScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCTutorial,
  },
};

export const MOCK_CLICK_KYC_START_VERIFICATION_EVENT: AnalyticsEvent<ClickKYCStartVerification> = {
  name: ANALYTICS_EVENT_NAMES.ClickKYCStartVerification,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    screenId: SCREEN_IDS.KYCTutorial,
  },
};

export const MOCK_VIEW_KYC_BANK_ACCOUNT_INFO_SCREEN_EVENT: AnalyticsPageView<ViewKYCBankAccountInfoScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCBankAccountInfoScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCBankAccountInfo,
  },
};

export const MOCK_CLICK_KYC_CONFIRM_BANK_ACCOUNT_INFO_EVENT: AnalyticsEvent<ClickKYCConfirmBankAccountInfo> = {
  name: ANALYTICS_EVENT_NAMES.ClickKYCConfirmBankAccountInfo,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    screenId: SCREEN_IDS.KYCBankAccountInfo,
  },
};

export const MOCK_VIEW_KYC_IDENTITY_VERIFICATION_SCREEN_EVENT: AnalyticsPageView<ViewKYCIdentityVerificationScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCIdentityVerificationScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCIdentityVerification,
  },
};

export const MOCK_VIEW_KYC_UPLOAD_IDENTITY_VERIFICATION_SCREEN_EVENT: AnalyticsPageView<ViewKYCUploadIdentityVerificationScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCUploadIdentityVerificationScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCUploadIdentityVerification,
    nationality: 'european_community',
  },
};

export const MOCK_VIEW_KYC_DOCUMENTATION_TYPE_SCREEN_EVENT: AnalyticsPageView<ViewKYCDocumentationTypeScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCDocumentationTypeScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCDocumentationType,
    typeOfDocument: 'residence_permit',
  },
};

export const MOCK_VIEW_KYC_REVIEW_DOCUMENTATION_IMAGE_SCREEN_EVENT: AnalyticsPageView<ViewKYCReviewDocumentationImageScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCReviewDocumentationImageScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCReviewDocumentationImage,
    typeOfDocument: 'driving_license',
  },
};

export const MOCK_CLICK_KYC_FINISH_IDENTITY_VERIFICATION_EVENT: AnalyticsEvent<ClickKYCFinishIdentityVerification> = {
  name: ANALYTICS_EVENT_NAMES.ClickKYCFinishIdentityVerification,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    screenId: SCREEN_IDS.KYCReviewDocumentationImage,
    typeOfDocument: 'passport',
  },
};

export const MOCK_VIEW_KYC_VERIFYING_IDENTITY_SCREEN_EVENT: AnalyticsPageView<ViewKYCVerifyingIdentityScreen> = {
  name: ANALYTICS_EVENT_NAMES.ViewKYCVerifyingIdentityScreen,
  attributes: {
    screenId: SCREEN_IDS.KYCVerifyingIdentity,
  },
};
