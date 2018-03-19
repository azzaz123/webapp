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

let service: AdService;
let http: HttpService;
let userService: UserService;
let mockBackend: MockBackend;
let cookieService: CookieService;
const cookies = {
  brand: 'bmv',
  content: 'i3',
  category: '100',
  minprice: '1000',
  maxprice: '20000'
};

const position = {
  coords: {
    latitude: 1,
    longitude: 2
  }
};

const AdKeyWords = {
  ...cookies,
  gender: MOCK_USER.gender,
  userId: MOCK_USER.id,
  latitude: position.coords.latitude.toString(),
  longitude: position.coords.longitude.toString()
};


describe('AdService', () => {
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
            }
          }
        }
      ],
    });
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    cookieService = TestBed.get(CookieService);
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function(callback) {
      callback(position);
    });
    Object.keys(cookies).forEach(key => {
      cookieService.put(key, cookies[key]);
    });
    service = TestBed.get(AdService);
  });

  describe ('refreshAds', () => {
    const refreshRate = 1000;
    const pubads = {
      setTargeting () {},
      refresh () {}
    };

    beforeEach(() => {
      spyOn(googletag, 'pubads').and.returnValue(pubads);
      spyOn(pubads, 'setTargeting');
      spyOn(pubads, 'refresh');
    });

    describe('with refresh rate should', () => {
      beforeEach(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          const res: ResponseOptions = new ResponseOptions({body: refreshRate});
          connection.mockRespond(new Response(res));
        });
      });

      it('send keyWords', fakeAsync(() => {
        service.startAdsRefresh();
        tick(1);

        Object.keys(AdKeyWords).forEach(key => {
          expect(pubads.setTargeting).toHaveBeenCalledWith(key, AdKeyWords[key]);
        });
        discardPeriodicTasks();
      }))

      it('without being able to access navigator geolocation, gets approximate position from backend', fakeAsync(() => {
        spyOn(navigator, 'geolocation').and.returnValue(undefined);
        service.adKeyWords.latitude = null;
        service.adKeyWords.longitude = null;

        service.startAdsRefresh();
        tick(1);

        expect(pubads.setTargeting).toHaveBeenCalledWith('latitude', MOCK_USER.location.approximated_latitude.toString());
        expect(pubads.setTargeting).toHaveBeenCalledWith('longitude', MOCK_USER.location.approximated_longitude.toString());
        discardPeriodicTasks();
      }));

      it('refresh ads with its rate', fakeAsync(() => {
        const timesToBeRefreshed = 2;

        service.startAdsRefresh();
        tick(timesToBeRefreshed * refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(timesToBeRefreshed + 1);
        discardPeriodicTasks();
      }));

      it('only have one refresh interval subscription', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);
        service.startAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(3);
        discardPeriodicTasks();
      }));

      it('stop refresh interval', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);

        service.stopAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(2);
      }));

      it('handle multiple stops', fakeAsync(() => {
        service.startAdsRefresh();
        tick(refreshRate);

        service.stopAdsRefresh();
        tick(refreshRate);
        service.stopAdsRefresh();
        tick(refreshRate);

        expect(pubads.refresh).toHaveBeenCalledTimes(2);
      }));
    });

    it('without refresh rate, should not refresh', fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: 0});
        connection.mockRespond(new Response(res));
      });

      service.startAdsRefresh();
      tick(refreshRate)

      expect(pubads.refresh).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }))
  })
});
