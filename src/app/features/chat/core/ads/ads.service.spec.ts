import {
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DidomiService } from '@core/didomi/didomi.service';
import { MockDidomiService } from '@core/didomi/didomi.service.spec';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { UserService } from '@core/user/user.service';
import { LOAD_EXTERNAL_LIBS_SERVICE_MOCK } from '@fixtures/load-external-libs.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { AdsService } from './ads.service';

let service: AdsService;
let userService: UserService;
let cookieService: CookieService;

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

describe('AdService', () => {
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
    service.loadAddsLibs();
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
