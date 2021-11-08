import { TestBed } from '@angular/core/testing';
import { MockDidomiService } from '@core/ads/vendors/didomi/didomi.mock';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import {
  MockAdShoppingPageOptions,
  MockAdsKeywords,
  MockAdSlots,
  MockAdSlotShopping,
  MockAmazonPublisherService,
  MockCriteoService,
  MockGooglePublisherTagService,
  MockLoadAdsService,
} from '@fixtures/ads.fixtures.spec';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';
import { of } from 'rxjs';
import { LoadAdsService } from '../load-ads/load-ads.service';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from './../../vendors';
import { AdsService } from './ads.service';

describe('AdsService', () => {
  let service: AdsService;
  let window: Window;
  let windowMock;

  windowMock = {
    fetchHeaderBids: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdsService,
        {
          provide: LoadAdsService,
          useValue: MockLoadAdsService,
        },
        {
          provide: AmazonPublisherService,
          useValue: MockAmazonPublisherService,
        },
        {
          provide: CriteoService,
          useValue: MockCriteoService,
        },
        {
          provide: GooglePublisherTagService,
          useValue: MockGooglePublisherTagService,
        },
        {
          provide: DidomiService,
          useValue: MockDidomiService,
        },
        {
          provide: DeviceService,
          useValue: MockDeviceService,
        },
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });

    service = TestBed.inject(AdsService);
    window = TestBed.inject(WINDOW_TOKEN);
  });

  describe('when initializing ads', () => {
    it('should try to load external advertisement libraries', () => {
      spyOn(MockLoadAdsService, 'loadAds').and.callThrough();

      service.init();

      expect(MockLoadAdsService.loadAds).toHaveBeenCalledTimes(1);
    });
  });

  describe('when set slots', () => {
    beforeEach(() => {
      service.init();
    });

    it('should set ad slots', () => {
      spyOn(MockGooglePublisherTagService, 'setSlots').and.callThrough();

      service.setSlots(MockAdSlots);

      expect(MockGooglePublisherTagService.setSlots).toHaveBeenCalledWith(MockAdSlots);
    });
  });

  describe('when slots are defined', () => {
    it('should register the device type in window for RichAudience purposes', () => {
      service.init();

      expect(window['deviceType']).toEqual(DeviceType.DESKTOP);
    });

    it('should get bids from RichAudience', () => {
      spyOn(windowMock, 'fetchHeaderBids').and.callThrough();

      service.init();

      expect(windowMock.fetchHeaderBids).toHaveBeenCalled();
    });

    it('should enable GPT services for showing Ad slots', () => {
      spyOn(MockGooglePublisherTagService, 'setPubAdsConfig');

      service.init();

      expect(MockGooglePublisherTagService.setPubAdsConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('when display ad slot shopping', () => {
    it('should wait to library', () => {
      spyOn(MockGooglePublisherTagService, 'displayShopping').and.callThrough();

      service.displayAdShopping(MockAdShoppingPageOptions, [MockAdSlotShopping]);

      expect(MockGooglePublisherTagService.displayShopping).toHaveBeenCalledTimes(0);
    });

    it('should set ad slot shopping', () => {
      spyOn(MockGooglePublisherTagService, 'displayShopping').and.callThrough();
      service.init();
      service.displayAdShopping(MockAdShoppingPageOptions, [MockAdSlotShopping]);

      expect(MockGooglePublisherTagService.displayShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, [MockAdSlotShopping]);
    });
  });

  describe('when set ad keywords', () => {
    it('should set ad keywords on google', () => {
      spyOn(MockGooglePublisherTagService, 'setAdKeywords').and.callThrough();

      service.setAdKeywords(MockAdsKeywords);

      expect(MockGooglePublisherTagService.setAdKeywords).toHaveBeenCalledWith(MockAdsKeywords);
    });
  });

  describe('when get ad slot loaded', () => {
    it('should return if ad is loaded', () => {
      spyOn(MockGooglePublisherTagService, 'isAdSlotLoaded$').and.returnValue(of(true));

      let expectedLoaded = false;
      service.adSlotLoaded$(MockAdSlots[0]).subscribe((loaded) => (expectedLoaded = loaded));

      expect(expectedLoaded).toEqual(true);
    });

    it('should return if ad is not loaded', () => {
      spyOn(MockGooglePublisherTagService, 'isAdSlotLoaded$').and.returnValue(of(false));

      let expectedLoaded = false;
      service.adSlotLoaded$(MockAdSlots[0]).subscribe((loaded) => (expectedLoaded = loaded));

      expect(expectedLoaded).toEqual(false);
    });
  });

  describe('when destroying slots', () => {
    it('should ask Google to destroy the selected slots', () => {
      spyOn(MockGooglePublisherTagService, 'destroySlots').and.callThrough();

      service.destroySlots([MockAdSlots[0]]);

      expect(MockGooglePublisherTagService.destroySlots).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clearing slots', () => {
    it('should ask Google to clear the selected slots', () => {
      spyOn(MockGooglePublisherTagService, 'clearSlots').and.callThrough();

      service.clearSlots([MockAdSlots[0]]);

      expect(MockGooglePublisherTagService.clearSlots).toHaveBeenCalledTimes(1);
    });
  });

  describe('when refreshing slots', () => {
    it('should ask Google to refresh the selected slots', () => {
      spyOn(MockGooglePublisherTagService, 'refreshSlots').and.callThrough();

      service.refreshSlots([MockAdSlots[0]]);

      expect(MockGooglePublisherTagService.refreshSlots).toHaveBeenCalledTimes(1);
    });
  });

  describe('when refreshing all slots', () => {
    it('should call RichAudience magic function to fetch new bidders and refresh slots', () => {
      spyOn(windowMock, 'fetchHeaderBids').and.callThrough();

      service.refreshAllSlots();

      expect(windowMock.fetchHeaderBids).toHaveBeenCalled();
    });
  });
});
