import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_CLICK_KYC_CONFIRM_BANK_ACCOUNT_INFO_EVENT,
  MOCK_CLICK_KYC_FINISH_IDENTITY_VERIFICATION_EVENT,
  MOCK_CLICK_KYC_SELECT_IMAGE_METHOD_CAMERA_EVENT,
  MOCK_CLICK_KYC_SELECT_IMAGE_METHOD_UPLOAD_EVENT,
  MOCK_CLICK_KYC_START_VERIFICATION_EVENT,
  MOCK_VIEW_KYC_BANK_ACCOUNT_INFO_SCREEN_EVENT,
  MOCK_VIEW_KYC_DOCUMENTATION_TYPE_SCREEN_EVENT,
  MOCK_VIEW_KYC_IDENTITY_VERIFICATION_SCREEN_EVENT,
  MOCK_VIEW_KYC_REVIEW_DOCUMENTATION_IMAGE_SCREEN_EVENT,
  MOCK_VIEW_KYC_TUTORIAL_SCREEN_EVENT,
  MOCK_VIEW_KYC_UPLOAD_IDENTITY_VERIFICATION_SCREEN_EVENT,
  MOCK_VIEW_KYC_VERIFYING_IDENTITY_SCREEN_EVENT,
} from '@fixtures/private/wallet/kyc/kyc-tracking-events.fixtures.spec';
import { KYC_TAKE_IMAGE_OPTIONS } from '../../components/kyc-image-options/kyc-image-options.enum';
import { KYCTrackingEventsService } from './kyc-tracking-events.service';

describe('KYCTrackingEventsService', () => {
  let service: KYCTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KYCTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(KYCTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when tracking view KYC tutorial screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCTutorialScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_TUTORIAL_SCREEN_EVENT);
    });
  });

  describe('when tracking click KYC start verification', () => {
    it('should track the event ', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickKYCStartVerification();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_KYC_START_VERIFICATION_EVENT);
    });
  });

  describe('when tracking view KYC bank account info screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCBankAccountInfoScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_BANK_ACCOUNT_INFO_SCREEN_EVENT);
    });
  });

  describe('when tracking click KYC confirm bank account info', () => {
    it('should track the event ', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickKYCConfirmBankAccountInfo();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_KYC_CONFIRM_BANK_ACCOUNT_INFO_EVENT);
    });
  });

  describe('when tracking view KYC identity verification screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCIdentityVerificationScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_IDENTITY_VERIFICATION_SCREEN_EVENT);
    });
  });

  describe('when tracking view KYC upload identity verification screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCUploadIdentityVerificationScreen('european_community');

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_UPLOAD_IDENTITY_VERIFICATION_SCREEN_EVENT);
    });
  });

  describe('when tracking view KYC documentation type screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCDocumentationTypeScreen('residence_permit');

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_DOCUMENTATION_TYPE_SCREEN_EVENT);
    });
  });

  describe('when tracking view KYC review documentation image screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCReviewDocumentationImageScreen('driving_license');

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_REVIEW_DOCUMENTATION_IMAGE_SCREEN_EVENT);
    });
  });

  describe('when tracking click KYC finish identity verification', () => {
    it('should track the event ', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickKYCFinishIdentityVerification('passport');

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_KYC_FINISH_IDENTITY_VERIFICATION_EVENT);
    });
  });

  describe('when tracking view KYC verifying identity screen', () => {
    it('should track the page view event ', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewKYCVerifyingIdentityScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_KYC_VERIFYING_IDENTITY_SCREEN_EVENT);
    });
  });

  describe('when tracking click KYC select image method', () => {
    describe('and the selected image method is shoot', () => {
      it('should track the event with camera method', () => {
        spyOn(analyticsService, 'trackEvent');

        service.trackClickKycSelectImageMethod(KYC_TAKE_IMAGE_OPTIONS.SHOOT);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_KYC_SELECT_IMAGE_METHOD_CAMERA_EVENT);
      });
    });

    describe('and the selected image method is upload', () => {
      it('should track the event with upload method', () => {
        spyOn(analyticsService, 'trackEvent');

        service.trackClickKycSelectImageMethod(KYC_TAKE_IMAGE_OPTIONS.UPLOAD);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_CLICK_KYC_SELECT_IMAGE_METHOD_UPLOAD_EVENT);
      });
    });
  });
});
