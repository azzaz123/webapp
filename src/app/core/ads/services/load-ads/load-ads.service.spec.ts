import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ADS_SOURCES } from '@core/ads/constants';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '@core/ads/vendors';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { TCF_API_COMMAND, TCF_API_VERSION } from '@core/ads/vendors/tcf/tcf.interface';
import { TcfService } from '@core/ads/vendors/tcf/tcf.service';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import {
  MockAmazonPublisherService,
  MockCriteoService,
  MockDidomiService,
  MockGooglePublisherTagService,
  MockTcfService,
} from '@fixtures/ads.fixtures.spec';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';
import { random } from 'faker';
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
        {
          provide: DidomiService,
          useValue: MockDidomiService,
        },
        {
          provide: TcfService,
          useValue: MockTcfService,
        },
      ],
    });

    service = TestBed.inject(LoadAdsService);
  });

  describe('when loading ads libraries', () => {
    it('should load scripts by sources', () => {
      spyOn(LoadExternalLibsServiceMock, 'loadScriptBySource').and.callThrough();

      service.loadAds().subscribe();

      expect(LoadExternalLibsServiceMock.loadScriptBySource).toHaveBeenCalledWith(ADS_SOURCES);
    });

    it('should wait to libs is defined', fakeAsync(() => {
      MockGooglePublisherTagService.isLibraryRefDefined = jest.fn(() => random.boolean());
      MockCriteoService.isLibraryRefDefined = jest.fn(() => random.boolean());
      MockAmazonPublisherService.isLibraryRefDefined = jest.fn(() => random.boolean());

      service.loadAds().subscribe();

      tick(10000);

      expect(MockGooglePublisherTagService.isLibraryRefDefined).toHaveLastReturnedWith(true);
      expect(MockCriteoService.isLibraryRefDefined).toHaveLastReturnedWith(true);
      expect(MockAmazonPublisherService.isLibraryRefDefined).toHaveLastReturnedWith(true);
    }));

    it('should load didomi', () => {
      spyOn(MockDidomiService, 'loadDidomiLib').and.callThrough();

      service.loadAds().subscribe();

      expect(MockDidomiService.loadDidomiLib).toHaveBeenCalledTimes(1);
    });

    it('should wait to didomi is defined', fakeAsync(() => {
      MockDidomiService.isLibraryRefDefined = jest.fn(() => random.boolean());

      service.loadAds().subscribe();
      tick(10000);

      expect(MockDidomiService.isLibraryRefDefined).toHaveLastReturnedWith(true);
    }));

    it('should attach tcf add event listener to init amazon publisher service when tc string is ready', fakeAsync(() => {
      spyOn(MockTcfService, 'tcfApi').and.callThrough();

      service.loadAds().subscribe();
      tick(10000);

      expect(MockTcfService.tcfApi).toHaveBeenCalledWith(TCF_API_COMMAND.ADD_EVENT_LISTENER, TCF_API_VERSION.V2, expect.any(Function));
    }));
  });
});
