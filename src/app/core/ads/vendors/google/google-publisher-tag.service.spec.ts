import { TestBed } from '@angular/core/testing';
import { AdSlot } from '@core/ads/models';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import {
  MockAdsKeywords,
  MockAdsKeywordsService,
  MockAdSlots,
} from '@fixtures/ads.fixtures.spec';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import {
  MOCK_GOOGLE_DEFINE_SLOT,
  MOCK_GOOGLE_PUBABDS,
  MOCK_GOOGLE_TAG,
} from './../../../../../configs/jest/global-mocks.fixtures.spec';
import { GooglePublisherTagService } from './google-publisher-tag.service';

describe('GooglePublisherTagService', () => {
  let service: GooglePublisherTagService;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      googletag: MOCK_GOOGLE_TAG,
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
      ],
    });
    service = TestBed.inject(GooglePublisherTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when init library', () => {
    it('should add the configuration of google', () => {
      spyOn(windowMock.googletag.cmd, 'push').and.callThrough();

      service.init(MockAdSlots);

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(
        jasmine.any(Function)
      );
    });

    it('should define ad slots', () => {
      spyOn(windowMock.googletag, 'defineSlot').and.callThrough();
      spyOn(MOCK_GOOGLE_DEFINE_SLOT, 'setTargeting').and.callThrough();
      spyOn(MOCK_GOOGLE_DEFINE_SLOT, 'addService').and.callThrough();
      service.init(MockAdSlots);

      MockAdSlots.forEach((slot: AdSlot) => {
        expect(windowMock.googletag.defineSlot).toHaveBeenCalledWith(
          slot.name,
          slot.sizes,
          slot.id
        );
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith(
          'ad_group',
          'ad_opt'
        );
        expect(MOCK_GOOGLE_DEFINE_SLOT.setTargeting).toHaveBeenCalledWith(
          'ad_h',
          jasmine.any(String)
        );
        expect(MOCK_GOOGLE_DEFINE_SLOT.addService).toHaveBeenCalled();
      });
    });

    it('should set pubads', () => {
      const publisherId = 'publisherId';
      spyOn(MOCK_GOOGLE_PUBABDS, 'enableSingleRequest').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'collapseEmptyDivs').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'disableInitialLoad').and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'setPublisherProvidedId').and.callThrough();
      spyOn(MockCookieService, 'get').and.returnValue(publisherId);

      service.init(MockAdSlots);

      expect(MOCK_GOOGLE_PUBABDS.enableSingleRequest).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.collapseEmptyDivs).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.disableInitialLoad).toHaveBeenCalledTimes(1);
      expect(MOCK_GOOGLE_PUBABDS.setPublisherProvidedId).toHaveBeenCalledWith(
        publisherId
      );
    });

    it('should enable services', () => {
      spyOn(windowMock.googletag, 'enableServices').and.callThrough();

      service.init(MockAdSlots);

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

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(
        jasmine.any(Function)
      );
    });

    it('should update the pubabs', () => {
      spyOn(
        MOCK_GOOGLE_PUBABDS,
        'setRequestNonPersonalizedAds'
      ).and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'refresh').and.callThrough();

      service.setAdsSegmentation();

      expect(
        MOCK_GOOGLE_PUBABDS.setRequestNonPersonalizedAds
      ).toHaveBeenCalledWith(1);
      expect(MOCK_GOOGLE_PUBABDS.refresh).toHaveBeenCalledTimes(1);
    });

    it('should update the pubabs with segmentation', () => {
      spyOn(
        MOCK_GOOGLE_PUBABDS,
        'setRequestNonPersonalizedAds'
      ).and.callThrough();
      spyOn(MOCK_GOOGLE_PUBABDS, 'refresh').and.callThrough();

      service.setAdsSegmentation(true);

      expect(
        MOCK_GOOGLE_PUBABDS.setRequestNonPersonalizedAds
      ).toHaveBeenCalledWith(0);
      expect(MOCK_GOOGLE_PUBABDS.refresh).toHaveBeenCalledTimes(1);
    });

    describe('when set targeting', () => {
      it('should update ad keywords', () => {
        spyOn(MockAdsKeywordsService, 'updateAdKeywords').and.callThrough();

        service.setTargetingByAdsKeywords();

        expect(MockAdsKeywordsService.updateAdKeywords).toHaveBeenCalledTimes(
          1
        );
      });

      it('should set targeting by ad keywords', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords();

        for (const key in MockAdsKeywords) {
          if (MockAdsKeywords.hasOwnProperty(key)) {
            expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith(
              key,
              MockAdsKeywords[key]
            );
          }
        }
      });

      it('should set targeting by segmentation', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords();

        expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith(
          'allowSegmentation',
          'false'
        );
      });

      it('should set targeting by segmentation to true', () => {
        spyOn(MOCK_GOOGLE_PUBABDS, 'setTargeting').and.callThrough();

        service.setTargetingByAdsKeywords(true);

        expect(MOCK_GOOGLE_PUBABDS.setTargeting).toHaveBeenCalledWith(
          'allowSegmentation',
          'true'
        );
      });
    });
  });

  describe('when we want to display by slot ', () => {
    it('should add on command', () => {
      spyOn(windowMock.googletag.cmd, 'push').and.callThrough();

      service.displayAdBySlotId(MockAdSlots[0].id);

      expect(windowMock.googletag.cmd.push).toHaveBeenCalledWith(
        jasmine.any(Function)
      );
    });

    it('should display by slot id', () => {
      const id = '512512';
      spyOn(MOCK_GOOGLE_TAG, 'display').and.callThrough();

      service.displayAdBySlotId(id);

      expect(MOCK_GOOGLE_TAG.display).toHaveBeenCalledWith(id);
    });
  });
});
