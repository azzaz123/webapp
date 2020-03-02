import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { WindowRef } from '../window/window.service';
import { UserService } from '../user/user.service';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { EventService } from '../event/event.service';

import { TrackingService } from './tracking.service';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures.spec';
import { NavigatorService } from './navigator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrackingEvent } from './tracking-event';

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

  let service: TrackingService;
  let eventService: EventService;
  let userService: UserService;
  let navigatorService: NavigatorService;
  let cookieService: CookieService;
  let window: any;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UserService, useClass: MockedUserService
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
        { provide: NavigatorService, useClass: MockedNavigatorService },
        TrackingService,
        EventService
      ]
    });
    eventService = TestBed.get(EventService);
    spyOn(eventService, 'subscribe').and.callThrough();
    service = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
    window = TestBed.get(WindowRef).nativeWindow;
    navigatorService = TestBed.get(NavigatorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('track', () => {
    it('should send event to server', () => {
      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });

      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeTruthy(); // ideally would be expectedSendEvent, but this service is going to be deprecated
    });

    it('should send professional flag when user is professional', () => {
      const expectedAttributes = JSON.stringify({ conversation_id: 'conversation', professional: true });
      spyOnProperty(userService, 'user').and.returnValue({ type: 'professional' });

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain(expectedAttributes);
    });

    it('should not send professional flag when user is not professional', () => {
      const expectedAttributes = JSON.stringify({ conversation_id: 'conversation' });
      spyOnProperty(userService, 'user').and.returnValue({ type: 'normal' });

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain(expectedAttributes);
    });
  });
});
