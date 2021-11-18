import { TestBed } from '@angular/core/testing';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import {
  MockAdShoppingPageOptions,
  MockAdsKeywords,
  MockAdsKeywordsService,
  MockAdSlots,
  MockAdSlotShopping,
  MockAdsTargetingsService,
} from '@fixtures/ads.fixtures.spec';
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
      _googCsa: (name, pageOptions, slot) => {},
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
        {
          provide: AdsTargetingsService,
          useValue: MockAdsTargetingsService,
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

    it('should filter slots by device type', () => {
      const adSlots: AdSlotConfiguration[] = [
        { ...MockAdSlots[0], device: [DeviceType.DESKTOP] },
        { ...MockAdSlots[0], device: [DeviceType.MOBILE] },
      ];
      spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      spyOn(windowMock.googletag, 'defineSlot').and.callThrough();

      service.setSlots(MockAdSlots);

      expect(windowMock.googletag.defineSlot).toHaveBeenCalledTimes(1);
    });

    it('should set size mapping if the slot has size mapping', () => {
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

      MockAdSlots.forEach((slot: AdSlotConfiguration) => {
        expect(windowMock.googletag.defineSlot).toHaveBeenCalledWith(slot.name, slot.sizes, slot.id);
        expect(MOCK_GOOGLE_DEFINE_SLOT.defineSizeMapping).toHaveBeenCalledTimes(1);
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith('ad_group', 'ad_opt');
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith('ad_h', jasmine.any(String));
        expect(MOCK_GOOGLE_DEFINE_SLOT.addService).toHaveBeenCalled();
      });
    });

    it('should notifiy that ad slots have been defined', () => {
      service.isAdSlotsDefined$.subscribe((slotsDefined: boolean) => {
        expect(slotsDefined).toEqual(true);
      });

      service.setSlots(MockAdSlots);
    });
  });

  describe('when setting pubads configuration', () => {
    it('should set pubads', () => {
      const publisherId = 'publisherId';
      spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      spyOn(MOCK_GOOGLE_PUBABDS, 'enableSingleRequest').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'collapseEmptyDivs').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'disableInitialLoad').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'setPublisherProvidedId').and.callThrough();
      spyOn(MockCookieService, 'get').and.returnValue(publisherId);

      service.setPubAdsConfig();

      expect(MOCK_GOOGLE_PUBABDS.enableSingleRequest).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.collapseEmptyDivs).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.disableInitialLoad).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.setPublisherProvidedId).toHaveBeenCalledWith(publisherId);
    });

    it('should enable services', () => {
      spyOn(windowMock.googletag, 'enableServices').and.callThrough();

      service.setPubAdsConfig();

      expect(windowMock.googletag.enableServices).toHaveBeenCalledTimes(1);
    });

    it('should get if ad slot is loaded in a subscribe', () => {
      spyOn(MOCK_GOOGLE_PUBABDS, 'addEventListener').and.callFake((name, fn) => {
        fn({ slot: { getAdUnitPath: () => MockAdSlots[0].name } });
      });
      let expectLoaded = false;
      service.setPubAdsConfig();

      service.isAdSlotLoaded$(MockAdSlots[0]).subscribe((loaded: boolean) => {
        expectLoaded = loaded;
      });

      expect(expectLoaded).toEqual(true);
    });

    it('should get if ad slot is not loaded in a subscribe', () => {
      let expectLoaded = false;
      service.setPubAdsConfig();

      service.isAdSlotLoaded$(MockAdSlots[0]).subscribe((loaded: boolean) => {
        expectLoaded = loaded;
      });

      expect(expectLoaded).toEqual(false);
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
    describe('when we want to refresh ads', () => {
      it('show refresh on google', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'refresh').and.callThrough();

        service.refreshAllSlots();

        expect(MOCK_GOOGLE_PUBABDS.refresh).toHaveBeenCalledTimes(1);
      });
    });

    describe('when set targeting', () => {
      it('should update ad keywords', () => {
        spyOn(MockAdsTargetingsService, 'setAdTargetings').and.callThrough();

        service.setTargetingByAdsKeywords();

        expect(MockAdsTargetingsService.setAdTargetings).toHaveBeenCalledTimes(1);
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
    });
  });

  describe('when we want to display ad slot shopping', () => {
    it('should set page options and slot shopping to lib', () => {
      spyOn(windowMock, '_googCsa').and.callThrough();

      service.displayShopping(MockAdShoppingPageOptions, [MockAdSlotShopping]);

      expect(windowMock._googCsa).toHaveBeenCalledWith('plas', { ...MockAdShoppingPageOptions, query: MockAdsKeywords.content }, [
        MockAdSlotShopping,
      ]);
    });
  });

  describe('when destroying slots', () => {
    it('should clear and remove the selected slot from memory', () => {
      spyOn(windowMock.googletag, 'destroySlots').and.callThrough();

      service.destroySlots([]);

      expect(windowMock.googletag.destroySlots).toHaveBeenCalledWith([]);
      expect(windowMock.googletag.destroySlots).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clearing slots', () => {
    it('should clear the selected slots', () => {
      spyOn(windowMock.googletag.pubads(), 'clear').and.callThrough();

      service.clearSlots([]);

      expect(windowMock.googletag.pubads().clear).toHaveBeenCalledWith([]);
      expect(windowMock.googletag.pubads().clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clearing slots', () => {
    it('should clear the selected slots', () => {
      spyOn(windowMock.googletag.pubads(), 'clear').and.callThrough();

      service.clearSlots([]);

      expect(windowMock.googletag.pubads().clear).toHaveBeenCalledWith([]);
      expect(windowMock.googletag.pubads().clear).toHaveBeenCalledTimes(1);
    });
  });
});
