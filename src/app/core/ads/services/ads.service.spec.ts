import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';

import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  getTestBed,
  inject,
  tick,
} from '@angular/core/testing';
import { MockDidomiService } from '@core/didomi/didomi.mock';
import { DidomiService } from '@core/didomi/didomi.service';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { UserService } from '@core/user/user.service';
import {
  MockAmazonPublisherService,
  MockCriteoService,
  MockGooglePublisherTagService,
} from '@fixtures/ads.fixtures.spec';
import { LOAD_EXTERNAL_LIBS_SERVICE_MOCK } from '@fixtures/load-external-libs.fixtures.spec';
import { MOCK_USER, MockedUserService } from '@fixtures/user.fixtures.spec';

import { ADS_SOURCES } from '../constants';
import { AdsService } from './ads.service';
import { AmazonPublisherService } from './amazon-publisher.service';
import { CriteoService } from './criteo.service';
import { GooglePublisherTagService } from './google-publisher-tag.service';

const cookiesAdKeyWord = {
  brand: 'bmv',
  content: 'i3',
  category: '100',
  minprice: '1000',
  maxprice: '20000',
};

const cookies = {
  ...cookiesAdKeyWord,
  publisherId: '123456' + Array(31).join('0'),
};

const position = {
  coords: {
    latitude: 1,
    longitude: 2,
  },
};

const AdKeyWords = {
  ...cookiesAdKeyWord,
  gender: MOCK_USER.gender,
  userId: MOCK_USER.id,
  latitude: position.coords.latitude.toString(),
  longitude: position.coords.longitude.toString(),
};

const cmd = {
  push(callbacks) {
    callbacks();
  },
};

const pubads = {
  defineSlot() {},
  enableSingleRequest() {},
  disableInitialLoad() {},
  collapseEmptyDivs() {},
  setPublisherProvidedId() {},
  setTargeting() {},
  refresh() {},
  setRequestNonPersonalizedAds() {},
};

const defineSlot = {
  addService() {},
  setTargeting() {
    return this;
  },
};

/*
xdescribe('AdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdsService,
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            put(key, value) {
              this.cookies[key] = value;
            },
            get(key) {
              return this.cookies[key];
            },
            remove(key) {
              delete this.cookies[key];
            },
          },
        },
        {
          provide: LoadExternalLibsService,
          useValue: LOAD_EXTERNAL_LIBS_SERVICE_MOCK,
        },
        {
          provide: DidomiService,
          useValue: MockDidomiService,
        },
      ],
    });
    userService = TestBed.inject(UserService);
    cookieService = TestBed.inject(CookieService);
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function (
      callback
    ) {
      callback(position);
    });
    spyOn(googletag, 'pubads').and.returnValue(pubads);
    spyOn(googletag, 'defineSlot').and.returnValue(defineSlot);
    spyOn(googletag, 'cmd').and.returnValue(cmd);
    spyOn(googletag, 'enableServices');
    spyOn(pubads, 'defineSlot');
    spyOn(pubads, 'enableSingleRequest');
    spyOn(pubads, 'collapseEmptyDivs');
    spyOn(pubads, 'disableInitialLoad');
    spyOn(pubads, 'setPublisherProvidedId');
    spyOn(pubads, 'setTargeting');
    spyOn(pubads, 'refresh');
    Object.keys(cookies).forEach((key) => {
      cookieService.put(key, cookies[key]);
    });
    service = TestBed.inject(AdsService);
    service.init();
    service.allowSegmentation$.next(false);
  });

  describe('should init google services', () => {
    it('enableSingleRequest', () => {
      expect(pubads.enableSingleRequest).toHaveBeenCalled();
    });
    it('collapseEmptyDivs', () => {
      expect(pubads.collapseEmptyDivs).toHaveBeenCalled();
    });
    it('disableInitialLoad', () => {
      expect(pubads.disableInitialLoad).toHaveBeenCalled();
    });
    it('setPublisherProvidedId', () => {
      expect(pubads.setPublisherProvidedId).toHaveBeenCalled();
    });
    it('enableServices', () => {
      expect(googletag.enableServices).toHaveBeenCalled();
    });
  });

  describe('publiser provider id', () => {
    it('should send publisherId of cookie', () => {
      expect(pubads.setPublisherProvidedId).toHaveBeenCalledWith(
        cookies.publisherId
      );
    });
    it('should send default publisherId of cookie -1*10e30', () => {
      const defaultPublisherId = '-1' + Array(31).join('0');

      cookieService.remove('publisherId');
      service['initGoogletagConfig']();

      expect(pubads.setPublisherProvidedId).toHaveBeenCalledWith(
        defaultPublisherId
      );
    });
  });

  describe('adsRefresh', () => {
    it('should send keyWords', fakeAsync(() => {
      service.adsRefresh();
      Object.keys(AdKeyWords).forEach((key) => {
        expect(pubads.setTargeting).toHaveBeenCalledWith(key, AdKeyWords[key]);
      });
      discardPeriodicTasks();
    }));

    it('should without being able to access navigator geolocation, gets approximate position from backend', fakeAsync(() => {
      spyOn(navigator, 'geolocation').and.returnValue(undefined);
      service.adKeyWords.latitude = null;
      service.adKeyWords.longitude = null;

      service.adsRefresh();
      tick(1);

      expect(pubads.setTargeting).toHaveBeenCalledWith(
        'latitude',
        MOCK_USER.location.approximated_latitude.toString()
      );
      expect(pubads.setTargeting).toHaveBeenCalledWith(
        'longitude',
        MOCK_USER.location.approximated_longitude.toString()
      );
      discardPeriodicTasks();
    }));

    describe('when allowSegmentation is true', () => {
      beforeEach(() => {
        service.allowSegmentation$.next(true);
      });

      it('should send keyWords allowSegmentation with true value', fakeAsync(() => {
        service.adsRefresh();

        expect(pubads.setTargeting).toHaveBeenCalledWith(
          'allowSegmentation',
          'true'
        );
        discardPeriodicTasks();
      }));

      it('should call DFP setRequestNonPersonalizedAds with value 0', fakeAsync(() => {
        spyOn(pubads, 'setRequestNonPersonalizedAds');

        service.adsRefresh();

        expect(pubads.setRequestNonPersonalizedAds).toHaveBeenCalledWith(0);
        discardPeriodicTasks();
      }));

      it('should call amazon APS fetchBids', fakeAsync(() => {
        spyOn(apstag, 'fetchBids');

        service.adsRefresh();

        expect(apstag.fetchBids).toHaveBeenCalled();
        discardPeriodicTasks();
      }));

      it('should call amazon APS setDisplayBids', fakeAsync(() => {
        spyOn(apstag, 'setDisplayBids');

        service.adsRefresh();

        expect(apstag.setDisplayBids).toHaveBeenCalled();
        discardPeriodicTasks();
      }));

      it('should call Criteo SetLineItemRanges', fakeAsync(() => {
        spyOn(Criteo, 'SetLineItemRanges');

        service.adsRefresh();

        expect(Criteo.SetLineItemRanges).toHaveBeenCalled();
        discardPeriodicTasks();
      }));

      it('should call Criteo SetDFPKeyValueTargeting', fakeAsync(() => {
        spyOn(Criteo, 'SetDFPKeyValueTargeting');

        service.adsRefresh();

        expect(Criteo.SetDFPKeyValueTargeting).toHaveBeenCalled();
        discardPeriodicTasks();
      }));
    });

    describe('when allowSegmentation is false', () => {
      beforeEach(() => {
        service.allowSegmentation$.next(false);
      });

      it('should send keyWords allowSegmentation with false value', fakeAsync(() => {
        service.adsRefresh();

        expect(pubads.setTargeting).toHaveBeenCalledWith(
          'allowSegmentation',
          'false'
        );
        discardPeriodicTasks();
      }));

      it('should call DFP setRequestNonPersonalizedAds with value 1', fakeAsync(() => {
        spyOn(pubads, 'setRequestNonPersonalizedAds');

        service.adsRefresh();

        expect(pubads.setRequestNonPersonalizedAds).toHaveBeenCalledWith(1);
        discardPeriodicTasks();
      }));
    });
  });
});
*/

describe('AdsService', () => {
  let injector: TestBed;
  let service: AdsService;
  let userService: UserService;
  let cookieService: CookieService;
  let loadExternalLibsService: LoadExternalLibsService;
  let didomiService: DidomiService;
  let amazonPublisherService: AmazonPublisherService;
  let criteoService: CriteoService;
  let googlePublisherTagService: GooglePublisherTagService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      providers: [
        AdsService,
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: CookieService,
          useValue: {
            get(_key) {
              return '';
            },
          },
        },
        {
          provide: LoadExternalLibsService,
          useValue: LOAD_EXTERNAL_LIBS_SERVICE_MOCK,
        },
        {
          provide: DidomiService,
          useValue: MockDidomiService,
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
      ],
    });

    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function (
      callback
    ) {
      callback(position);
    });

    service = injector.inject(AdsService);
    userService = injector.inject(UserService);
    cookieService = injector.inject(CookieService);
    loadExternalLibsService = injector.inject(LoadExternalLibsService);
    didomiService = injector.inject(DidomiService);
    amazonPublisherService = injector.inject(AmazonPublisherService);
    criteoService = injector.inject(CriteoService);
    googlePublisherTagService = injector.inject(GooglePublisherTagService);
  });

  describe('when initializing ads', () => {
    it('should try to load external advertisement libraries', () => {
      spyOn(loadExternalLibsService, 'loadScriptBySource');

      service.init();

      expect(loadExternalLibsService.loadScriptBySource).toHaveBeenCalledWith(
        ADS_SOURCES
      );
    });

    it('should load initial config for advertisement', () => {
      spyOn(googlePublisherTagService, 'init');
      spyOn(amazonPublisherService, 'init');

      service.init();

      expect(googlePublisherTagService.init).toHaveBeenCalledTimes(1);
      expect(amazonPublisherService.init).toHaveBeenCalledTimes(1);
    });
  });
});
