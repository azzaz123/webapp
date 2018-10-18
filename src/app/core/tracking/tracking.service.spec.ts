/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
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

const eventsArray = [
  {
    eventData: TrackingService.NOTIFICATION_RECEIVED,
    attributes: {thread_id: 'conversation', message_id: '123', item_id: 'xyz'}
  },
  {
    eventData: TrackingService.MESSAGE_RECEIVED,
    attributes: {thread_id: 'abc', message_id: '234', item_id: 'xyz'}
  },
  {
    eventData: TrackingService.MESSAGE_RECEIVED,
    attributes: {thread_id: 'abc', message_id: '345', item_id: 'zyx'}
  }
];

const sendInterval = 10000;


describe('Service: Tracking', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService, useValue: {
          user: {
            id: 'userId'
          },
          isProfessional() {
            return Observable.of(false);
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
      service.track(TrackingService.NOTIFICATION_RECEIVED, {conversation_id: 'conversation'});
      expect((service as any).createNewEvent).toHaveBeenCalledWith(TrackingService.NOTIFICATION_RECEIVED,
        {conversation_id: 'conversation'});
    });
    it('should do a post to clickstream', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      service.track(TrackingService.NOTIFICATION_RECEIVED, {conversation_id: 'conversation'});
      expect(http.postNoBase['calls'].argsFor(0)[0]).toBe('https://collector.wallapop.com/clickstream.json/sendEvents');
    });
  });

  describe('addTrackingEvent', () => {
    it('should add the tracking event multiple times if acceptDuplicates is true or is missing', () => {
      service.addTrackingEvent(eventsArray[0], true);
      service.addTrackingEvent(eventsArray[0]);
      service.addTrackingEvent(eventsArray[0]);

      const eventInstances = service['pendingTrackingEvents'].filter(e => e === eventsArray[0]).length;

      expect(service['pendingTrackingEvents']).toContain(eventsArray[0]);
      expect(eventInstances).toBe(3);
    });

    it('should only add the tracking event once if acceptDuplicates is false', () => {
      service.addTrackingEvent(eventsArray[0], false);
      service.addTrackingEvent(eventsArray[0], false);
      service.addTrackingEvent(eventsArray[0], false);

      const eventInstances = service['pendingTrackingEvents'].filter(e => e === eventsArray[0]).length;

      expect(service['pendingTrackingEvents']).toContain(eventsArray[0]);
      expect(eventInstances).toBe(1);
    });

    it('should NOT add the tracking event if acceptDuplicates is false and the event has been sent previously', () => {
      service['sentEvents'] = [eventsArray[0]];

      service.addTrackingEvent(eventsArray[0], false);

      expect(service['pendingTrackingEvents']).not.toContain(eventsArray[0]);
    });
  });

  describe('trackAccumulatedEvents', () => {
    it('should send a batch of events accumulated when it has reached the maxBatchSize limit', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      const maxBatchSize = 1000;
      let x = 0;

      service.trackAccumulatedEvents();
      while (x < maxBatchSize) {
        service.addTrackingEvent(eventsArray[0]);
        x++;
      }

      expect(http.postNoBase['calls'].argsFor(0)[0]).toContain('clickstream.json/sendEvents');
    });

    it('should send a batch of events after the sendInterval time has passed', (fakeAsync(() => {
      spyOn(http, 'postNoBase').and.callThrough();

      service.trackAccumulatedEvents();
      service.addTrackingEvent(eventsArray[0]);
      tick(sendInterval);

      expect(http.postNoBase['calls'].argsFor(0)[0]).toContain('clickstream.json/sendEvents');
      discardPeriodicTasks();
    })));

    it('should add the event to the sentEvents array if the post request completes successfully', (fakeAsync(() => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      const firstEvent = Object.assign({}, eventsArray[0]);

      service.trackAccumulatedEvents();
      service.addTrackingEvent(eventsArray[0]);
      tick(sendInterval);

      expect(service['sentEvents']).toContain(firstEvent);
      expect(service['pendingTrackingEvents'].length).toBe(0);
      discardPeriodicTasks();
    })));
  });

});
