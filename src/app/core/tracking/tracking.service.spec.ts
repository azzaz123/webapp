/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { WindowRef } from '../window/window.service';
import { NavigatorService } from './navigator.service';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { environment } from '../../../environments/environment';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures.spec';

let service: TrackingService;
let eventService: EventService;
let persistencyService: PersistencyService;
let userService: UserService;
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
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService, useClass: MockedUserService
        },
        {
          provide: PersistencyService, useValue: {
            storeClickstreamEvent() { },
            storePackagedClickstreamEvents() { },
            getPackagedClickstreamEvents() {
              return Observable.of([]);
            },
            getClickstreamEvents() {
              return Observable.of([]);
            },
            removePackagedClickstreamEvents() {
              return Observable.of(true);
            },
            clickstreamDbName: 'mockName'
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
        { provide: NavigatorService, useClass: MockedNavigatorService },
        TEST_HTTP_PROVIDERS,
        TrackingService,
        EventService
      ]
    });
    eventService = TestBed.get(EventService);
    spyOn(eventService, 'subscribe').and.callThrough();
    service = TestBed.get(TrackingService);
    persistencyService = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    http = TestBed.get(HttpService);
    window = TestBed.get(WindowRef).nativeWindow;
  });

  describe('subscribe to DB_READY and HTTP_REQUEST_FAILED events', () => {
    it('should subscribe to the EventService.DB_READY event', () => {
      expect(eventService.subscribe['calls'].argsFor(0)[0]).toBe(EventService.DB_READY);
      expect(eventService.subscribe['calls'].argsFor(1)[0]).toBe(EventService.HTTP_REQUEST_FAILED);
    });

    it('should call persistencyService.getPackagedClickstreamEvents when a DB_READY event is emitted with the clickstreamDbName', () => {
      spyOn(persistencyService, 'getPackagedClickstreamEvents').and.returnValue(Observable.of([]));

      eventService.emit(EventService.DB_READY, persistencyService.clickstreamDbName);

      expect(persistencyService.getPackagedClickstreamEvents).toHaveBeenCalled();
    });

    it('should call http.postNoBase with the packaged event found in the DB, when a DB_READY event is emitted with the clickstreamDbName', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn(persistencyService, 'getPackagedClickstreamEvents').and.returnValue(Observable.of([TRACKING_EVENT]));

      eventService.emit(EventService.DB_READY, persistencyService.clickstreamDbName);

      expect(http.postNoBase).toHaveBeenCalled();
    });

    it('should call addTrackingEvent for each individual event found in the dB, when a DB_READY event is emitted with the clickstreamDbName', () => {
      spyOn(persistencyService, 'getClickstreamEvents').and.returnValue(Observable.of(eventsArray));
      spyOn(service, 'addTrackingEvent');

      eventService.emit(EventService.DB_READY, persistencyService.clickstreamDbName);

      expect(service.addTrackingEvent).toHaveBeenCalledTimes(eventsArray.length);
    });
  });

  describe('track', () => {
    it('should call createNewEvent with passing the given arguments', () => {
      spyOn<any>(service, 'createNewEvent').and.callThrough();

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });

      expect((service as any).createNewEvent).toHaveBeenCalledWith(TrackingService.NOTIFICATION_RECEIVED,
        { conversation_id: 'conversation' });
    });

    it('should do a post to clickstream', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();

      const result = service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });

      expect(http.postNoBase['calls'].argsFor(0)[0]).toBe(environment.clickStreamURL);
      expect(result).toBeTruthy();
    });

    it('should set the attribute professional to TRUE when the user.type is professional', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      spyOnProperty(userService, 'user').and.returnValue({ type: 'professional' });

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
      const expectedAttributes = JSON.stringify({ conversation_id: 'conversation', professional: true });

      expect(http.postNoBase['calls'].argsFor(0)[1]).toContain(expectedAttributes);
    });

    it('should NOT set the attribute professional to TRUE when the user.type is not professional', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      spyOnProperty(userService, 'user').and.returnValue({ type: 'normal' });

      service.track(TrackingService.NOTIFICATION_RECEIVED, { conversation_id: 'conversation' });
      const expectedAttributes = JSON.stringify({ conversation_id: 'conversation' });

      expect(http.postNoBase['calls'].argsFor(0)[1]).toContain(expectedAttributes);
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

    it('should store the event in the indexedBd after the Db is ready', () => {
      spyOn(persistencyService, 'storeClickstreamEvent').and.returnValue({});

      service.addTrackingEvent(eventsArray[0]);
      eventService.emit(EventService.DB_READY, persistencyService.clickstreamDbName);

      expect(persistencyService.storeClickstreamEvent).toHaveBeenCalledWith(eventsArray[0]);
    });
  });

  describe('trackAccumulatedEvents', () => {
    describe('when POST requests are sucessful', () => {
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

      it('should call persistencyService.storePackagedClickstreamEvents with an object containing the event', (fakeAsync(() => {
        spyOn(http, 'postNoBase').and.callThrough();
        spyOn(persistencyService, 'storePackagedClickstreamEvents');

        service.trackAccumulatedEvents();
        service.addTrackingEvent(eventsArray[0]);
        tick(sendInterval);

        expect(persistencyService.storePackagedClickstreamEvents).toHaveBeenCalled();
        expect(persistencyService.storePackagedClickstreamEvents['calls'].argsFor(0)[0].sessions[0].events[0])
          .toEqual(eventsArray[0]);
        discardPeriodicTasks();
      })));

      it('should call persistencyService.removePackagedClickstreamEvents after the post request completes successfully', (fakeAsync(() => {
        spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
        spyOn(persistencyService, 'removePackagedClickstreamEvents').and.returnValue(Observable.of({}));

        service.trackAccumulatedEvents();
        service.addTrackingEvent(eventsArray[0]);
        tick(sendInterval);

        expect(persistencyService.removePackagedClickstreamEvents).toHaveBeenCalled();
        expect(persistencyService.removePackagedClickstreamEvents['calls'].argsFor(0)[0].sessions[0].events[0])
          .toEqual(eventsArray[0]);
        discardPeriodicTasks();
      })));

      it('should add the event to the sentEvents array', (fakeAsync(() => {
        spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
        const firstEvent = Object.assign({}, eventsArray[0]);

        service.trackAccumulatedEvents();
        service.addTrackingEvent(eventsArray[0]);
        tick(sendInterval);

        expect(service['sentEvents']).toContain(firstEvent);
        expect(service['pendingTrackingEvents'].length).toBe(0);
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

    describe('when POST requests return errors', () => {
      it('should NOT make a POST request if a previous POST request has failed (HTTP_REQUEST_FAILED emitted)', fakeAsync(() => {
        spyOn(http, 'postNoBase').and.callThrough();

        service.trackAccumulatedEvents();
        eventService.emit(EventService.HTTP_REQUEST_FAILED, environment.clickStreamURL);
        service.addTrackingEvent(eventsArray[0]);
        tick(sendInterval);

        expect(http.postNoBase).not.toHaveBeenCalled();
        discardPeriodicTasks();
      }));
    });
  });
});
