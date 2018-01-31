import {
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks
} from '@angular/core/testing';
import { AdService } from './ad.service';
import { TEST_HTTP_PROVIDERS, HttpService, MOCK_USER } from 'shield';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MockBackend, MockConnection } from '@angular/http/testing';

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
            }
          }
        }
      ],
    });
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    cookieService = TestBed.get(CookieService);
    Object.keys(cookies).forEach(key => {
      cookieService.put(key, cookies[key]);
    });
    service = TestBed.get(AdService);
  });

  describe ('refreshAds should', () => {
    const refreshRate = 1000;
    const pubads = {
      setTargeting () {},
      refresh () {}
    }

    beforeEach(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: refreshRate});
        connection.mockRespond(new Response(res));

        spyOn(googletag, 'pubads').and.returnValue(pubads);
        spyOn(pubads, 'setTargeting');
        spyOn(pubads, 'refresh');
      });
    });

    it('send keyWords', fakeAsync(() => {
      service.startAdsRefresh();
      tick(1);

      Object.keys(cookies).forEach(key => {
        expect(pubads.setTargeting).toHaveBeenCalledWith(key, cookies[key]);
      });
      discardPeriodicTasks();
    }))

    it('refresh ads with its rate' , fakeAsync(() => {
      const timesToBeRefreshed = 2;

      service.startAdsRefresh();
      tick(timesToBeRefreshed * refreshRate );

      expect(pubads.refresh).toHaveBeenCalledTimes(timesToBeRefreshed + 1);
      discardPeriodicTasks();
    }));
  })
});
