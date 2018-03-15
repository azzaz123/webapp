/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { WindowRef } from '../window/window.service';
import { NavigatorService } from './navigator.service';

let service: TrackingService;
let cookieService: CookieService;
let http: HttpService;
let window: any;

class MockedNavigatorService {
  private parseVersionInfo() {
  }

  private setOperativeSystem() {
  }

  get browserName() {
    return 'Chrome';
  }

  get fullVersion() {
    return 'Chrome 55';
  }

  get operativeSystem() {
    return 'Windows';
  }
}

describe('Service: Tracking', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService, useValue: {
          user: {
            id: 'userId'
          }
        }
        },
        {
          provide: WindowRef, useValue: {
          nativeWindow: {
            screen: {
              width: 1366,
              height: 768
            },
            locale: 'es'
          }
        }
        },
        {
          provide: CookieService, useValue: {
          put(key, value) {
          },
          get(key) {
            return 'a-b-c';
          },
        }
        },
        {provide: NavigatorService, useClass: MockedNavigatorService},
        TEST_HTTP_PROVIDERS,
        TrackingService
      ]
    });
    service = TestBed.get(TrackingService);
    http = TestBed.get(HttpService);
    window = TestBed.get(WindowRef).nativeWindow;
  });
  describe('track', () => {
    it('should call createNewEvent with passing the given arguments', () => {
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      service.track(TrackingService.MESSAGE_NOTIFIED, {conversation_id: 'conversation'});
      expect((service as any).createNewEvent).toHaveBeenCalledWith(TrackingService.MESSAGE_NOTIFIED,
        {conversation_id: 'conversation'});
    });
    it('should do a post to clickstream', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      service.track(TrackingService.MESSAGE_NOTIFIED, {conversation_id: 'conversation'});
      expect(http.postNoBase['calls'].argsFor(0)[0]).toBe('https://collector.wallapop.com/clickstream.json/sendEvents');
    });
  });

});
