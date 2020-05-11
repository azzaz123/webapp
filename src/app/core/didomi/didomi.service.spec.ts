import { TestBed, getTestBed } from '@angular/core/testing';
import { DidomiService } from './didomi.service';
import { DIDOMI_EMBED } from './didomi-embed-script';

export const MockDidomiService = {
  isReady: true,
  initialize: () => {}
};

describe('Service: Didomi', () => {
  let injector: TestBed;
  let service: DidomiService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      providers: [ DidomiService ]
    });
    service = injector.inject(DidomiService);

    spyOn(service.isReady$, 'next');
    window['didomiOnReady'] = [];

    service.initialize();
    window['didomiOnReady'][0](); // Executed by the Didomi SDK when ready
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('when initializing the service', () => {
    it('should add Didomi SDK to app', () => {
      spyOn(document.head, 'appendChild');
      const expectedScript: HTMLScriptElement = document.createElement('script');
      expectedScript.setAttribute('type', 'text/javascript');
      expectedScript.setAttribute('charset', 'utf-8');
      expectedScript.text = DIDOMI_EMBED;

      service.initialize();

      expect(document.head.appendChild).toHaveBeenCalledTimes(1);
      expect(document.head.appendChild).toHaveBeenCalledWith(expectedScript);
    });

    it('should notify that service is ready when SDK is ready', () => {
      expect(service.isReady).toBe(true);
      expect(service.isReady$.next).toHaveBeenCalledTimes(1);
      expect(service.isReady$.next).toHaveBeenCalledWith(true);
      expect(service.library).toEqual(Didomi);
    });
  });

  describe('when library is not ready', () => {
    it('should consider that user is not allowing segmentation for ads', () => {
      service.library = null;

      expect(service.userAllowedSegmentationInAds()).toBe(false);
    });
  });

  describe('when user accepts all GDPR vendors and purpouses', () => {
    it('should allow user segmentation for ads', () => {
      expect(service.userAllowedSegmentationInAds()).toBe(true);
    });
  });

  describe('when user does not accept all GDPR vendors and purpouses', () => {
    beforeEach(() => {
      spyOn(Didomi, 'getUserConsentStatusForPurpose').and.returnValue(false);
      spyOn(Didomi, 'getUserConsentStatusForVendor').and.returnValue(false);
    });

    it('should not allow user segmentation for ads', () => {
      expect(service.userAllowedSegmentationInAds()).toBe(false);
    });
  });

  describe('when user does not accept Google vendor', () => {
    it('should', () => {
      spyOn(Didomi, 'getUserConsentStatusForVendor').and.callFake(key => {
        if (key === 'google') {
          return false;
        }
      });

      expect(service.userAllowedSegmentationInAds()).toBe(false);
    });
  });

  describe('when user does not accept the personalized ads purpouse', () => {
    it('should', () => {
      spyOn(Didomi, 'getUserConsentStatusForPurpose').and.callFake(key => {
        if (key === 'advertising_personalization') {
          return false;
        }
      });

      expect(service.userAllowedSegmentationInAds()).toBe(false);
    });
  });
});
