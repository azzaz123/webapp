import { TestBed } from '@angular/core/testing';
import { AdSlot } from '@core/ads/models';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { MockAdsKeywords, MockAdsKeywordsService, MockAdSlots } from '@fixtures/ads.fixtures.spec';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { random } from 'faker';
import { CookieService } from 'ngx-cookie';
import {
  MOCK_GOOGLE_DEFINE_SLOT,
  MOCK_GOOGLE_PUBABDS,
  MOCK_GOOGLE_SIZE_MAPPING,
  MOCK_GOOGLE_TAG,
} from './../../../../../configs/jest/global-mocks.fixtures.spec';
import { GooglePublisherTagService } from './google-publisher-tag.service';

describe('GooglePublisherTagService', () => {
  let service: GooglePublisherTagService;
  let windowMock;
  let deviceServiceMock;

  beforeEach(() => {
    windowMock = {
      googletag: MOCK_GOOGLE_TAG,
    };

    deviceServiceMock = {
      getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
    };

    TestBed.configureTestingModule({
      providers: [
        GooglePublisherTagService,
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: AdsKeywordsService,
          useValue: MockAdsKeywordsService,
        },
        {
          provide: DeviceService,
          useValue: deviceServiceMock,
        },
      ],
    });
    service = TestBed.inject(GooglePublisherTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when set Slots', () => {
    it('should add the configuration of google', () => {
      spyOn(windowMock.googletag.cmd, 'push').and.callThrough();

      service.setSlots(MockAdSlots);

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should set size mapping if the slot has', () => {
      spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      spyOn(MOCK_GOOGLE_TAG, 'sizeMapping').and.callThrough();
      spyOn(MOCK_GOOGLE_SIZE_MAPPING, 'addSize').and.callThrough();
      spyOn(MOCK_GOOGLE_SIZE_MAPPING, 'build');

      service.setSlots(MockAdSlots);

      MockAdSlots.forEach((slot) => {
        expect(MOCK_GOOGLE_TAG.sizeMapping).toHaveBeenCalled();
        expect(MOCK_GOOGLE_SIZE_MAPPING.addSize).toHaveBeenCalledWith(
          slot.sizeMapping.desktop.screenSize,
          slot.sizeMapping.desktop.mapping
        );
        expect(MOCK_GOOGLE_SIZE_MAPPING.addSize).toHaveBeenCalledWith(slot.sizeMapping.tablet.screenSize, slot.sizeMapping.tablet.mapping);
        expect(MOCK_GOOGLE_SIZE_MAPPING.addSize).toHaveBeenCalledWith(slot.sizeMapping.mobile.screenSize, slot.sizeMapping.mobile.mapping);
        expect(MOCK_GOOGLE_SIZE_MAPPING.build).toHaveBeenCalled();
      });
    });

    it('should define ad slots', () => {
      spyOn(windowMock.googletag, 'defineSlot').and.callThrough();
      spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      spyOn(MOCK_GOOGLE_DEFINE_SLOT, 'setTargeting').and.callThrough();
      spyOn(MOCK_GOOGLE_DEFINE_SLOT, 'addService').and.callThrough();
      spyOn(MOCK_GOOGLE_DEFINE_SLOT, 'defineSizeMapping').and.callThrough();

      service.setSlots(MockAdSlots);

      MockAdSlots.forEach((slot: AdSlot) => {
        expect(windowMock.googletag.defineSlot).toHaveBeenCalledWith(slot.name, slot.sizes, slot.id);
        expect(MOCK_GOOGLE_DEFINE_SLOT.defineSizeMapping).toHaveBeenCalledTimes(1);
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith('ad_group', 'ad_opt');
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith('ad_h', jasmine.any(String));
        expect(MOCK_GOOGLE_DEFINE_SLOT.addService).toHaveBeenCalled();
      });
    });

    it('should set pubads', () => {
      const publisherId = 'publisherId';
      spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      spyOn(MOCK_GOOGLE_PUBABDS, 'enableSingleRequest').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'collapseEmptyDivs').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'disableInitialLoad').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'setPublisherProvidedId').and.callThrough();
      spyOn(MockCookieService, 'get').and.returnValue(publisherId);

      service.setSlots(MockAdSlots);

      expect(MOCK_GOOGLE_PUBABDS.enableSingleRequest).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.collapseEmptyDivs).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.disableInitialLoad).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.setPublisherProvidedId).toHaveBeenCalledWith(publisherId);
    });

    it('should enable services', () => {
      spyOn(windowMock.googletag, 'enableServices').and.callThrough();

      service.setSlots(MockAdSlots);

      expect(windowMock.googletag.enableServices).toHaveBeenCalledTimes(1);
    });
  });

  describe('when we check if library is defined or not', () => {
    it('should check if the library is not defined', () => {
      windowMock.googletag = null;

      const isDefined: boolean = service.isLibraryRefDefined();

      expect(isDefined).toBe(false);
    });

    it('should check if the library is defined', () => {
      const isDefined: boolean = service.isLibraryRefDefined();

      expect(isDefined).toBe(true);
    });
  });

  describe('when set segmentation', () => {
    it('should add the configuration of google', () => {
      spyOn(windowMock.googletag.cmd, 'push').and.callThrough();

      service.setAdsSegmentation();

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should update the pubabs', () => {
      spyOn(MOCK_GOOGLE_PUBABDS, 'setRequestNonPersonalizedAds').and.callThrough();

      service.setAdsSegmentation();

      expect(MOCK_GOOGLE_PUBABDS.setRequestNonPersonalizedAds).toHaveBeenCalledWith(1);
    });

    it('should update the pubabs with segmentation', () => {
      spyOn(MOCK_GOOGLE_PUBABDS, 'setRequestNonPersonalizedAds').and.callThrough();

      service.setAdsSegmentation(true);

      expect(MOCK_GOOGLE_PUBABDS.setRequestNonPersonalizedAds).toHaveBeenCalledWith(0);
    });

    describe('when we want to refresh ads', () => {
      it('show refresh on google', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'refresh').and.callThrough();

        service.refreshAds();

        expect(MOCK_GOOGLE_PUBABDS.refresh).toHaveBeenCalledTimes(1);
      });
    });

    describe('when set targeting', () => {
      it('should update ad keywords', () => {
        spyOn(MockAdsKeywordsService, 'updateAdKeywords').and.callThrough();

        service.setTargetingByAdsKeywords();

        expect(MockAdsKeywordsService.updateAdKeywords).toHaveBeenCalledTimes(1);
      });

      it('should set targeting by ad keywords', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords();

        for (const key in MockAdsKeywords) {
          if (MockAdsKeywords.hasOwnProperty(key)) {
            expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith(key, MockAdsKeywords[key]);
          }
        }
      });

      it('should set targeting by segmentation', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords();

        expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith('allowSegmentation', 'false');
      });

      it('should set targeting by segmentation to true', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords(true);

        expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith('allowSegmentation', 'true');
      });
    });
  });

  describe('when we want to display by slot ', () => {
    it('should add on command', () => {
      spyOn(windowMock.googletag.cmd, 'push').and.callThrough();

      service.displayAdBySlotId(MockAdSlots[0].id);

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should display by slot id', () => {
      const id = '512512';
      spyOn(MOCK_GOOGLE_TAG, 'display').and.callThrough();

      service.displayAdBySlotId(id);

      expect(MOCK_GOOGLE_TAG.display).toHaveBeenCalledWith(id);
    });
  });
});
