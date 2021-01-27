import { AdSlot } from './../../models/ad-slot.interface';
import { TestBed } from '@angular/core/testing';
import { ADS_SOURCES } from '@core/ads/constants';
import {
  AmazonPublisherService,
  CriteoService,
  GooglePublisherTagService,
} from '@core/ads/vendors';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import {
  MockAmazonPublisherService,
  MockCriteoService,
  MockGooglePublisherTagService,
} from '@fixtures/ads.fixtures.spec';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';
import { of } from 'rxjs';
import { LoadAdsService } from './load-ads.service';
describe('LoadAdsService', () => {
  let service: LoadAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadAdsService,
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
          provide: LoadExternalLibsService,
          useValue: LoadExternalLibsServiceMock,
        },
      ],
    });

    service = TestBed.inject(LoadAdsService);
  });

  describe('when loading ads libraries', () => {
    it('should load all libraries', () => {
      spyOn(LoadExternalLibsServiceMock, 'loadScriptBySource').and.returnValue(
        of(null)
      );

      service.loadAds().subscribe();

      expect(
        LoadExternalLibsServiceMock.loadScriptBySource
      ).toHaveBeenCalledWith(ADS_SOURCES);
    });

    it('should check all libraries once ads are loaded', () => {
      spyOn(LoadExternalLibsServiceMock, 'loadScriptBySource').and.returnValue(
        of(null)
      );

      spyOn(MockAmazonPublisherService, 'isLibraryRefDefined').and.returnValue(
        true
      );
      spyOn(MockCriteoService, 'isLibraryRefDefined').and.returnValue(true);
      spyOn(
        MockGooglePublisherTagService,
        'isLibraryRefDefined'
      ).and.returnValue(true);

      service.loadAds().subscribe((allReady: boolean) => {
        expect(allReady).toBe(true);
      });
    });

    it('should wait to all libraries are checked to load', () => {
      spyOn(LoadExternalLibsServiceMock, 'loadScriptBySource').and.returnValue(
        of(null)
      );

      spyOn(
        MockAmazonPublisherService,
        'isLibraryRefDefined'
      ).and.returnValues([false, true]);
      spyOn(MockCriteoService, 'isLibraryRefDefined').and.returnValues([
        false,
        false,
        true,
      ]);

      spyOn(
        MockGooglePublisherTagService,
        'isLibraryRefDefined'
      ).and.returnValue(true);

      service.loadAds().subscribe((allReady: boolean) => {
        expect(allReady).toBe(true);
      });
    });
  });

  describe('when we want to set slots', () => {
    it('should set in google library', () => {
      const slots: AdSlot[] = [
        {
          id: 'div-gpt-ad-1508490196308-0',
          name: '/130868815/chat_right',
          sizes: [
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
            [336, 280],
          ],
          networkId: 235235,
        },
      ];
      spyOn(MockGooglePublisherTagService, 'init').and.callThrough();

      service.setSlots(slots);

      expect(MockGooglePublisherTagService.init).toHaveBeenCalledWith(slots);
    });
  });
});
