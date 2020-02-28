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

const eventsArray = [
  {
    eventData: TrackingService.NOTIFICATION_RECEIVED,
    attributes: { thread_id: 'conversation', message_id: '123' }
  },
  {
    eventData: TrackingService.MESSAGE_RECEIVED,
    attributes: { thread_id: 'abc', message_id: '234' }
  },
  {
    eventData: TrackingService.MESSAGE_RECEIVED,
    attributes: { thread_id: 'abc', message_id: '345' }
  }
];

const sendInterval = 10000;


describe('Service: Tracking', () => {

  let service: TrackingService;
  let eventService: EventService;
  let userService: UserService;
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
  });

  describe('track', () => {
    it('should call createNewEvent with passing the given arguments', () => {
      spyOn<any>(service, 'createNewEvent').and.callThrough();

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });

      expect((service as any).createNewEvent).toHaveBeenCalledWith(TrackingService.NOTIFICATION_RECEIVED,
        { conversation_id: 'conversation' });
    });

    // it('should do a post to clickstream', () => {
    //   spyOn(httpMock, 'postNoBase').and.returnValue(of({}));
    //   spyOn<any>(service, 'createNewEvent').and.callThrough();

    //   const result = service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });

    //   expect(httpMock.postNoBase['calls'].argsFor(0)[0]).toBe(environment.clickStreamURL);
    //   expect(result).toBeTruthy();
    // });

    // it('should set the attribute professional to TRUE when the user.type is professional', () => {
    //   spyOn(httpMock, 'postNoBase').and.returnValue(of({}));
    //   spyOn<any>(service, 'createNewEvent').and.callThrough();
    //   spyOnProperty(userService, 'user').and.returnValue({ type: 'professional' });

    //   service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
    //   const expectedAttributes = JSON.stringify({ conversation_id: 'conversation', professional: true });

    //   expect(httpMock.postNoBase['calls'].argsFor(0)[1]).toContain(expectedAttributes);
    // });

    // it('should NOT set the attribute professional to TRUE when the user.type is not professional', () => {
    //   spyOn(httpMock, 'postNoBase').and.returnValue(of({}));
    //   spyOn<any>(service, 'createNewEvent').and.callThrough();
    //   spyOnProperty(userService, 'user').and.returnValue({ type: 'normal' });

    //   service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
    //   const expectedAttributes = JSON.stringify({ conversation_id: 'conversation' });

    //   expect(httpMock.postNoBase['calls'].argsFor(0)[1]).toContain(expectedAttributes);
    // });
  });

  describe('addTrackingEvent', () => {

  });
});
