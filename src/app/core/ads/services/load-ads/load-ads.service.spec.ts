import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ADS_SOURCES } from '@core/ads/constants';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '@core/ads/vendors';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { TcData, TCF_API_COMMAND, TCF_API_VERSION, TCF_EVENT_STATUS } from '@core/ads/vendors/tcf/tcf.interface';
import { TcfService } from '@core/ads/vendors/tcf/tcf.service';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import {
  MockAmazonPublisherService,
  MockCriteoService,
  MockDidomiService,
  MockGooglePublisherTagService,
  MockTcData,
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

    describe('when attaching tcf actions listener', () => {
      it('should init Amazon Publisher services when the user action is complete and successful', fakeAsync(() => {
        spyOn(MockAmazonPublisherService, 'init');
        spyOn(MockTcfService, 'tcfApi').and.callFake((command, version, cb) => {
          if (command === TCF_API_COMMAND.ADD_EVENT_LISTENER) cb(MockTcData, true);
        });

        service.loadAds().subscribe();
        tick(10000);

        expect(MockAmazonPublisherService.init).toHaveBeenCalled();
      }));

      it('should not init Amazon Publisher services when the user action is not successful', fakeAsync(() => {
        spyOn(MockAmazonPublisherService, 'init');
        spyOn(MockTcfService, 'tcfApi').and.callFake((command, version, cb) => {
          if (command === TCF_API_COMMAND.ADD_EVENT_LISTENER) cb(MockTcData, false);
        });

        service.loadAds().subscribe();
        tick(10000);

        expect(MockAmazonPublisherService.init).not.toHaveBeenCalled();
      }));

      it('should not init Amazon Publisher services when the user action is successful but there is no tc string', fakeAsync(() => {
        MockTcData.tcString = undefined;
        spyOn(MockAmazonPublisherService, 'init');
        spyOn(MockTcfService, 'tcfApi').and.callFake((command, version, cb) => {
          if (command === TCF_API_COMMAND.ADD_EVENT_LISTENER) cb(MockTcData, true);
        });

        service.loadAds().subscribe();
        tick(10000);

        expect(MockAmazonPublisherService.init).not.toHaveBeenCalled();
      }));
    });
  });
});
