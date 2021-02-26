import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockDidomiService } from '@core/ads/vendors/didomi/didomi.mock';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import {
  MockAdSlots,
  MockAmazonPublisherService,
  MockCriteoService,
  MockGooglePublisherTagService,
  MockLoadAdsService,
} from '@fixtures/ads.fixtures.spec';
import { of } from 'rxjs';
import { LoadAdsService } from '../load-ads/load-ads.service';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from './../../vendors';
import { AdsService } from './ads.service';

describe('AdsService', () => {
  let service: AdsService;

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
      ],
    });

    service = TestBed.inject(AdsService);
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

    it('it should refresh ads', () => {
      spyOn(MockGooglePublisherTagService, 'refreshAds').and.callThrough();

      service.setSlots(MockAdSlots);

      expect(MockGooglePublisherTagService.refreshAds).toHaveBeenCalledTimes(1);
    });
  });

  describe('when refreshing ads', () => {
    beforeEach(() => {
      service.init();
    });

    it('should set targeting to Google library', () => {
      spyOn(MockGooglePublisherTagService, 'setTargetingByAdsKeywords').and.callThrough();

      service.refresh();

      expect(MockGooglePublisherTagService.setTargetingByAdsKeywords).toHaveBeenCalledTimes(1);
    });

    it('should ask for ads bidders to Amazon and Criteo', () => {
      spyOn(MockAmazonPublisherService, 'requestBid').and.callThrough();
      spyOn(MockCriteoService, 'requestBid').and.callThrough();

      service.refresh();

      expect(MockAmazonPublisherService.requestBid).toHaveBeenCalledTimes(1);
      expect(MockCriteoService.requestBid).toHaveBeenCalledTimes(1);
    });

    it('should set segmentation to Google', fakeAsync(() => {
      const ALLOW_SEGMENTATION = true;
      spyOn(MockGooglePublisherTagService, 'setAdsSegmentation').and.callThrough();
      spyOn(MockDidomiService, 'allowSegmentation$').and.returnValue(of(ALLOW_SEGMENTATION));

      service.refresh();
      tick(1000);

      expect(MockGooglePublisherTagService.setAdsSegmentation).toHaveBeenCalledWith(ALLOW_SEGMENTATION);
    }));

    it('should refresh ads on google', () => {
      spyOn(MockGooglePublisherTagService, 'refreshAds').and.callThrough();

      service.refresh();

      expect(MockGooglePublisherTagService.refreshAds).toHaveBeenCalledTimes(1);
    });
  });

  describe('when displaying an ad by id', () => {
    it('should wait to library ready to display ad', () => {
      const adSotId = MockAdSlots[0].id;
      spyOn(MockGooglePublisherTagService, 'displayAdBySlotId');

      service.displayAdBySlotId(adSotId);

      expect(MockGooglePublisherTagService.displayAdBySlotId).toHaveBeenCalledTimes(0);

      service.init();

      expect(MockGooglePublisherTagService.displayAdBySlotId).toHaveBeenLastCalledWith(adSotId);
    });

    it('should ask Google to display ad if is lib ready', () => {
      service.init();
      const adSlotId = MockAdSlots[0].id;
      spyOn(MockGooglePublisherTagService, 'displayAdBySlotId');

      service.displayAdBySlotId(adSlotId);

      expect(MockGooglePublisherTagService.displayAdBySlotId).toHaveBeenLastCalledWith(adSlotId);
    });
  });
});
