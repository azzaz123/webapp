import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdService } from './ad.service';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { PrivacyService } from '../privacy/privacy.service';

let service: AdService;
let http: HttpService;
let userService: UserService;
let mockBackend: MockBackend;
let cookieService: CookieService;
let privacyService: PrivacyService;

const cookiesAdKeyWord = {
  brand: 'bmv',
  content: 'i3',
  category: '100',
  minprice: '1000',
  maxprice: '20000'
};

const cookies = {
  ...cookiesAdKeyWord,
  publisherId: '123456' + Array(31).join('0')
};

const position = {
  coords: {
    latitude: 1,
    longitude: 2
  }
};

const AdKeyWords = {
  ...cookiesAdKeyWord,
  gender: MOCK_USER.gender,
  userId: MOCK_USER.id,
  latitude: position.coords.latitude.toString(),
  longitude: position.coords.longitude.toString()
};

const cmd = {
  push(callbacks) {
    callbacks();
  }
};

const pubads = {
  defineSlot() {},
  enableSingleRequest() {},
  disableInitialLoad() {},
  collapseEmptyDivs() {},
  setPublisherProvidedId() {},
  setTargeting () {},
  refresh () {}
};

const defineSlot = {
  addService() {}
};

let geolocationSpy;

fdescribe('AdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdService,
        ...TEST_HTTP_PROVIDERS,
        {
          provide: UserService,
          useValue: {
            me() {
              return Observable.of(MOCK_USER)
            }
          }
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            put(key, value) {
              this.cookies[key] = value;
            },
            get (key) {
              return this.cookies[key];
            },
            remove (key) {
              delete this.cookies[key];
            }
          }
        },
        PrivacyService
      ],
    });
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    cookieService = TestBed.get(CookieService);
    privacyService = TestBed.get(PrivacyService);
    geolocationSpy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function(callback) {
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
    Object.keys(cookies).forEach(key => {
      cookieService.put(key, cookies[key]);
    });
    service = TestBed.get(AdService);
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
      expect(pubads.setPublisherProvidedId).toHaveBeenCalledWith(cookies.publisherId);
    });
    it('should send default publisherId of cookie -1*10e30', () => {
      const defaultPublisherId = '-1' + Array(31).join('0');

      cookieService.remove('publisherId');
      service['initGoogletagConfig']();

      expect(pubads.setPublisherProvidedId).toHaveBeenCalledWith(defaultPublisherId);
    });
  });

  describe ('refreshAds', () => {
    const refreshRate = 1000;

    describe('with refresh rate, ', () => {
      beforeEach(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const res: ResponseOptions = new ResponseOptions({body: refreshRate});
          connection.mockRespond(new Response(res));
        });
      });

      it('should send keyWords', fakeAsync(() => {
        service.startAdsRefresh();
        tick(1);
        Object.keys(AdKeyWords).forEach(key => {
          expect(pubads.setTargeting).toHaveBeenCalledWith(key, AdKeyWords[key]);
        });
        discardPeriodicTasks();
      }));

      it('should without being able to access navigator geolocation, gets approximate position from backend', fakeAsync(() => {
        spyOn(navigator, 'geolocation').and.returnValue(undefined);
        service.adKeyWords.latitude = null;
        service.adKeyWords.longitude = null;

        service.startAdsRefresh();
        tick(1);

        expect(pubads.setTargeting).toHaveBeenCalledWith('latitude', MOCK_USER.location.approximated_latitude.toString());
        expect(pubads.setTargeting).toHaveBeenCalledWith('longitude', MOCK_USER.location.approximated_longitude.toString());
        discardPeriodicTasks();
      }));

      it('should refresh ads with its rate', fakeAsync(() => {
        const timesToBeRefreshed = 2;

        service.startAdsRefresh();
        tick(timesToBeRefreshed * refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(timesToBeRefreshed + 1);
        discardPeriodicTasks();
      }));

      it('should only have one refresh interval subscription', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);
        service.startAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(3);
        discardPeriodicTasks();
      }));

      it('should stop refresh interval', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);

        service.stopAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(2);
      }));

      it('should handle multiple stops', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);

        service.stopAdsRefresh();
        tick(refreshRate);
        service.stopAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(2);
      }));

      describe('when allowSegmentation is true', () => {
        beforeEach(() => {
          privacyService.allowSegmentation$.next(true);
        });

        it('should send keyWords allowSegmentation with true value', fakeAsync(() => {
          service.startAdsRefresh();
          tick(refreshRate);

          expect(pubads.setTargeting).toHaveBeenCalledWith('allowSegmentation', 'true');
          discardPeriodicTasks();
        }));

        it('should call amazon APS fetchBids', fakeAsync(() => {
          spyOn(apstag, 'fetchBids');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(apstag.fetchBids).toHaveBeenCalled();
          discardPeriodicTasks();
        }));

        it('should call amazon APS setDisplayBids', fakeAsync(() => {
          spyOn(apstag, 'setDisplayBids');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(apstag.setDisplayBids).toHaveBeenCalled();
          discardPeriodicTasks();
        }));

        it('should call Criteo SetLineItemRanges', fakeAsync(() => {
          spyOn(Criteo, 'SetLineItemRanges');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(Criteo.SetLineItemRanges).toHaveBeenCalled();
          discardPeriodicTasks();
        }));

        it('should call Criteo SetDFPKeyValueTargeting', fakeAsync(() => {
          spyOn(Criteo, 'SetDFPKeyValueTargeting');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(Criteo.SetDFPKeyValueTargeting).toHaveBeenCalled();
          discardPeriodicTasks();
        }));
      });

      describe('when allowSegmentation is false', () => {
        beforeEach(() => {
          privacyService.allowSegmentation$.next(false);
        });

        it('should send keyWords allowSegmentation with true value', fakeAsync(() => {
          service.startAdsRefresh();
          tick(refreshRate);

          expect(pubads.setTargeting).toHaveBeenCalledWith('allowSegmentation', 'false');
          discardPeriodicTasks();
        }));

        it('should call amazon APS fetchBids', fakeAsync(() => {
          spyOn(apstag, 'fetchBids');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(apstag.fetchBids).not.toHaveBeenCalled();
          discardPeriodicTasks();
        }));

        it('should call amazon APS setDisplayBids', fakeAsync(() => {
          spyOn(apstag, 'setDisplayBids');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(apstag.setDisplayBids).not.toHaveBeenCalled();
          discardPeriodicTasks();
        }));
        //
        it('should call Criteo SetLineItemRanges', fakeAsync(() => {
          spyOn(Criteo, 'SetLineItemRanges');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(Criteo.SetLineItemRanges).not.toHaveBeenCalled();
          discardPeriodicTasks();
        }));

        it('should call Criteo SetDFPKeyValueTargeting', fakeAsync(() => {
          spyOn(Criteo, 'SetDFPKeyValueTargeting');

          service.startAdsRefresh();
          tick(refreshRate);

          expect(Criteo.SetDFPKeyValueTargeting).not.toHaveBeenCalled();
          discardPeriodicTasks();
        }));
      });
    });

    it('without refresh rate, should not refresh', fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: 0});
        connection.mockRespond(new Response(res));
      });

      service.startAdsRefresh();
      tick(refreshRate);

      expect(pubads.refresh).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }));
  });
});
