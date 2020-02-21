/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PersistencyService } from './persistency.service';
import { MESSAGE_MAIN, MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { Message, phoneRequestState } from '../message/message';
import {
  MOCK_DB_FILTERED_RESPONSE,
  MOCK_DB_RESPONSE,
  MockedConversationsDb,
  MockedInboxDb,
  MockedMessagesDb
} from '../../../tests/persistency.fixtures.spec';
import { CONVERSATION_DATE_ISO, CONVERSATION_ID } from '../../../tests/conversation.fixtures.spec';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { EventService } from '../event/event.service';
import { TrackingService } from '../tracking/tracking.service';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures.spec';

let service: PersistencyService;
let userService: UserService;
let eventService: EventService;
const MOCK_SAVE_DATA: any = {last: 'asdas', start: CONVERSATION_DATE_ISO};
const { IDBFactory, reset } = require('shelving-mock-indexeddb');

describe('Service: Persistency', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersistencyService,
        EventService,
        { provide: UserService, useValue: {
          me() { return Observable.of(MOCK_USER); },
          user() { return Observable.of(MOCK_USER); },
          }
        }
      ],
    });
    service = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    eventService = TestBed.get(EventService);
    (service as any)['_messagesDb'] = new MockedMessagesDb();
    (service as any)['_conversationsDb'] = new MockedConversationsDb();
    (service as any)['_inboxDb'] = new MockedInboxDb();
  });

  it('should call localDbVersionUpdate through the constructor after USER_LOGIN event is trigegred', () => {
    spyOn(service, 'localDbVersionUpdate').and.callThrough();
    spyOn(userService, 'me').and.returnValue(Observable.of(MOCK_USER));
    spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.of({version: 1.0}));

    eventService.emit(EventService.USER_LOGIN);

    expect(service.localDbVersionUpdate).toHaveBeenCalled();
  });

  describe('init clickstream DB', () => {
    it('should open a new indexedDb', () => {
      spyOn(window.indexedDB, 'open').and.callThrough();
      spyOn(userService, 'me').and.returnValue(Observable.of(MOCK_USER));

      eventService.emit(EventService.USER_LOGIN);

      expect(window.indexedDB.open).toHaveBeenCalled();
    });
  });

  describe('indexedDb operations for clickstream events', () => {
    let eventsStoreName, db, clickstreamDbName, request, packagedEventsStoreName;
    beforeEach(() => {
      reset();
      eventsStoreName = 'events-' + MOCK_USER.id;
      packagedEventsStoreName = service['packagedEventsStore'];
      clickstreamDbName = service.clickstreamDbName;
      service['eventsStore'] = eventsStoreName;

      db = new IDBFactory();
      request = db.open(clickstreamDbName, 1);

      request.addEventListener('upgradeneeded', () => {
        request.result.createObjectStore(eventsStoreName, { keyPath: 'id' });
        request.result.createObjectStore(packagedEventsStoreName, { autoIncrement: true });
      });
    });
    afterEach(() => reset());


    it('should store the new event in the indexedBb when storeClickstreamEvent is called', (done) => {
      const mockTrackEvent: TrackingEventData = {
        eventData: TrackingService.MESSAGE_SENT,
        id: '123',
        attributes: { thread_id: MOCK_MESSAGE.thread, message_id: MOCK_MESSAGE.id }
      };

      request.addEventListener('success', () => {
        service['clickstreamDb'] = request.result;

        service.storeClickstreamEvent(mockTrackEvent);

        request.result.transaction([eventsStoreName], 'readwrite').objectStore(eventsStoreName);
        const getTransaction = request.result.transaction([eventsStoreName], 'readonly');
        const getStore = getTransaction.objectStore(eventsStoreName);
        getStore.get(mockTrackEvent.id).addEventListener('success', (event) => {
          expect(event.target.result).toEqual(mockTrackEvent);
          done();
        });
      });
    });

    it('should store the packaged clickstream events in the indexedBb when storePackagedClickstreamEvents is called', (done) => {
      const mockPackagedEvents = JSON.parse(JSON.stringify(TRACKING_EVENT));

      request.addEventListener('success', () => {
        service['clickstreamDb'] = request.result;

        service.storePackagedClickstreamEvents(mockPackagedEvents);

        const getTransaction = request.result.transaction([packagedEventsStoreName], 'readonly');
        const getStore = getTransaction.objectStore(packagedEventsStoreName);
        getStore.get(TRACKING_EVENT.sessions[0].events[0].id).addEventListener('success', (event) => {
          expect(event.target.result).toEqual(mockPackagedEvents);
          done();
        });
      });
    });

    it('should get all the clickstream events from the indexedBb when getClickstreamEvents is called', (done) => {
      const mockTrackEvents: TrackingEventData[] = [
        { eventData: TrackingService.MESSAGE_SENT,
          id: '1',
          attributes: { thread_id: MOCK_MESSAGE.thread, message_id: MOCK_MESSAGE.id + '1' }},
        { eventData: TrackingService.MESSAGE_RECEIVED,
          id: '2',
          attributes: { thread_id: MOCK_MESSAGE.thread, message_id: MOCK_MESSAGE.id  + '2' }},
        { eventData: TrackingService.MESSAGE_READ,
          id: '3',
          attributes: { thread_id: MOCK_MESSAGE.thread, message_id: MOCK_MESSAGE.id + '3' }}
      ];
      request.addEventListener('success', () => {
        service['clickstreamDb'] = request.result;
        service.storeClickstreamEvent(mockTrackEvents[0]);
        service.storeClickstreamEvent(mockTrackEvents[1]);
        service.storeClickstreamEvent(mockTrackEvents[2]);

        service.getClickstreamEvents().subscribe(r => {

          expect(r).toEqual(mockTrackEvents);
          done();
        });
      });
    });

    it('should get all the packaged clickstream events from the indexedBb when getPackagedClickstreamEvents is called', (done) => {
      const firstEventPack = JSON.parse(JSON.stringify(TRACKING_EVENT));
      const secondEventPack = JSON.parse(JSON.stringify(TRACKING_EVENT));
      const expectedResult = [firstEventPack, secondEventPack];
      request.addEventListener('success', () => {
        service['clickstreamDb'] = request.result;
        const putTransaction = request.result.transaction([packagedEventsStoreName], 'readwrite');
        const putStore = putTransaction.objectStore(packagedEventsStoreName);
        putStore.put(firstEventPack);
        putStore.put(secondEventPack);

        service.getPackagedClickstreamEvents().subscribe(r => {

          expect(r).toEqual(expectedResult);
          done();
        });
      });
    });

    it('should remove the packaged clickstream events when removePackagedClickstreamEvents is called', (done) => {
      const firstEventPack = JSON.parse(JSON.stringify(TRACKING_EVENT));
      const storedWithKey = firstEventPack.sessions[0].events[0].id;
      request.addEventListener('success', () => {
        service['clickstreamDb'] = request.result;
        const transaction = request.result.transaction([packagedEventsStoreName], 'readwrite');
        const store = transaction.objectStore(packagedEventsStoreName);
        store.put(firstEventPack, storedWithKey);

        service.removePackagedClickstreamEvents(firstEventPack).subscribe(() => {

          service.getPackagedClickstreamEvents().subscribe(r => {
            expect(r).not.toContain(firstEventPack);
            done();
          });
        });
      });
    });
  });

  describe('getMessages', () => {

    let observableResponse: any;

    describe('with success', () => {

      beforeEach(fakeAsync(() => {
        spyOn(service.messagesDb, 'allDocs').and.returnValue(Promise.resolve(MOCK_DB_RESPONSE));
        service.getMessages(MESSAGE_MAIN.thread).subscribe((data: any) => {
          observableResponse = data;
        });
        tick();
      }));

      it('should get the messages if they exist in the db', () => {
        expect(observableResponse).toEqual(MOCK_DB_FILTERED_RESPONSE);
        expect(service.messagesDb.allDocs).toHaveBeenCalledWith({include_docs: true});
      });

      it('should sort the messages by date', () => {
        expect(observableResponse[0].id).toEqual(MOCK_DB_FILTERED_RESPONSE[0].id);
        expect(observableResponse[1].id).toEqual(MOCK_DB_FILTERED_RESPONSE[1].id);
      });

      it('should not call allDocs more than 1 time', fakeAsync(() => {
        let observableResponse1: any;
        let observableResponse2: any;

        service.getMessages(MESSAGE_MAIN.thread).subscribe((data: any) => {
          observableResponse1 = data;
        });
        service.getMessages(MESSAGE_MAIN.thread).subscribe((data: any) => {
          observableResponse2 = data;
        });
        tick();

        expect(service.messagesDb.allDocs).toHaveBeenCalledTimes(1);
        expect(observableResponse).toEqual(MOCK_DB_FILTERED_RESPONSE);
        expect(observableResponse1).toEqual(MOCK_DB_FILTERED_RESPONSE);
        expect(observableResponse2).toEqual(MOCK_DB_FILTERED_RESPONSE);
      }));

    });

    it('should get an empty array if the messages do not exist on the db', fakeAsync(() => {
      spyOn(service.messagesDb, 'allDocs').and.returnValue(Promise.reject({}));

      service.getMessages(MESSAGE_MAIN.thread).subscribe((data: any) => {
        observableResponse = data;
      });
      tick();

      expect(observableResponse).toEqual([]);
      expect(service.messagesDb.allDocs).toHaveBeenCalledWith({include_docs: true});
    }));
  });

  describe('saveMetaInformation', () => {
    beforeEach(fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();
    }));

    it('should be called with the new date when a CHAT_LAST_RECEIVED_TS event is emitted', () => {
      spyOn(service, 'saveMetaInformation');
      const newTimestamp = new Date().getTime();
      const newMeta = {
        start: new Date(newTimestamp).toISOString(),
        last: null
      };

      eventService.emit(EventService.CHAT_LAST_RECEIVED_TS, newTimestamp);

      expect(service.saveMetaInformation).toHaveBeenCalledWith(newMeta);
    });

    it('should upsert the meta information', fakeAsync(() => {
      service.saveMetaInformation(MOCK_SAVE_DATA).subscribe();

      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe('meta');
    }));
  });

  describe('getMetaInformation', () => {
    it('should return the meta information from the database', () => {
      spyOn(service.messagesDb, 'get').and.returnValue(Promise.resolve({}));

      service.getMetaInformation();

      expect(service.messagesDb.get).toHaveBeenCalledWith('meta');
    });
  });

  describe('localDbVersionUpdate', () => {
    let callbackCalled = false;
    function mockCallback() { callbackCalled = true; }

    beforeEach(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve());
      spyOn<any>(service, 'saveDbVersion').and.callThrough();
      callbackCalled = false;
    });

    it(`should save the version and call the callback method when called with a version number
    greater than the current version number`, () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.of({version: 1.0}));

      service.localDbVersionUpdate(service.messagesDb, 1.2, mockCallback);

      expect(service['saveDbVersion']).toHaveBeenCalled();
      expect(callbackCalled).toBe(true);
    });

    it(`should save the version and call the callback method when the error reason is 'missing'`, () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.throw({reason: 'missing'}));

      service.localDbVersionUpdate(service.messagesDb, 1.2, mockCallback);

      expect(service['saveDbVersion']).toHaveBeenCalled();
      expect(callbackCalled).toBe(true);
    });

    it(`should NOT save the version  NOR call the callback method when the error message reason is not 'missing'`, () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.throw({reason: 'something else'}));

      service.localDbVersionUpdate(service['_messagesDb'], 1.2, mockCallback);

      expect(service['saveDbVersion']).not.toHaveBeenCalled();
      expect(callbackCalled).toBe(false);
    });

    it(`should NOT call saveDbVersion, NOT call the callback method AND emit a EventService.DB_READY event when called
    with a version number less than the current version number`, () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.of({version: 2.0}));
      spyOn(eventService, 'emit');

      service.localDbVersionUpdate(service.messagesDb, 1.2, mockCallback);

      expect(service['saveDbVersion']).not.toHaveBeenCalled();
      expect(callbackCalled).toBe(false);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.DB_READY);
    });
  });

  describe('resetCache', () => {
    it('should set the storedMessages to null', () => {
      service['storedMessages'] = MOCK_DB_FILTERED_RESPONSE[0];

      service.resetCache();

      expect(service['storedMessages']).toBe(null);
    });
  });
});

