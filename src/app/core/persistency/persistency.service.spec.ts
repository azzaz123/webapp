/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PersistencyService } from './persistency.service';
import { createMessagesArray, MESSAGE_MAIN, MOCK_MESSAGE, MOCK_PAYLOAD_OK } from '../../../tests/message.fixtures.spec';
import { Message, messageStatus, phoneRequestState } from '../message/message';
import {
  MOCK_DB_FILTERED_RESPONSE,
  MOCK_DB_RESPONSE,
  MockedConversationsDb,
  MockedMessagesDb
} from '../../../tests/persistency.fixtures.spec';
import { CONVERSATION_DATE_ISO, CONVERSATION_ID } from '../../../tests/conversation.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';
import { MOCK_USER, USER_ID, OTHER_USER_ID } from '../../../tests/user.fixtures.spec';
import { EventService } from '../event/event.service';

let service: PersistencyService;
let userService: UserService;
let eventService: EventService;
const MOCK_SAVE_DATA: any = {last: 'asdas', start: CONVERSATION_DATE_ISO};

describe('Service: Persistency', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersistencyService,
        EventService,
        {provide: UserService, useValue: { me() { return Observable.of(MOCK_USER); }}}
      ],
    });
    service = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    eventService = TestBed.get(EventService);
    (service as any)['_messagesDb'] = new MockedMessagesDb();
    (service as any)['_conversationsDb'] = new MockedConversationsDb();
  });

  it('should call localDbVersionUpdate through the constructor after USER_LOGIN event is trigegred', () => {
    spyOn(service, 'localDbVersionUpdate').and.callThrough();
    spyOn(userService, 'me').and.returnValue(Observable.of(MOCK_USER));
    spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.of({version: 1.0}));

    eventService.emit(EventService.USER_LOGIN);

    expect(service.localDbVersionUpdate).toHaveBeenCalled();
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

  describe('buildResponse', () => {
    it('should return the object message that will be saved on the database', () => {
      expect((service as any).buildResponse(MOCK_MESSAGE)).toEqual({
        _id: MOCK_MESSAGE.id,
        date: MOCK_MESSAGE.date,
        message: MOCK_MESSAGE.message,
        status: MOCK_MESSAGE.status,
        from: MOCK_MESSAGE.from.split('@')[0],
        conversationId: MOCK_MESSAGE.conversationId,
        payload: undefined,
        phoneRequest: undefined
      });
    });
    it('should return the object message with payload that will be saved on the database', () => {
      const MOCK_MESSAGE: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        MESSAGE_MAIN.from,
        MESSAGE_MAIN.date,
        messageStatus.READ,
        MOCK_PAYLOAD_OK
      );
      expect((service as any).buildResponse(MOCK_MESSAGE)).toEqual({
        _id: MOCK_MESSAGE.id,
        date: MOCK_MESSAGE.date,
        message: MOCK_MESSAGE.message,
        status: MOCK_MESSAGE.status,
        from: MOCK_MESSAGE.from.split('@')[0],
        conversationId: MOCK_MESSAGE.conversationId,
        payload: MOCK_PAYLOAD_OK,
        phoneRequest: undefined
      });
    });
  });

  describe('saveMessages', () => {
    it('should save the messages with bulkDocs when an array of messages is passed', fakeAsync(() => {
      spyOn(service.messagesDb, 'bulkDocs').and.returnValue(Promise.resolve());
      spyOn<any>(service, 'buildResponse');
      const messages: Array<Message> = createMessagesArray(2);
      let saveMessagePromise: any;
      service.saveMessages(messages).subscribe((data: any) => {
        saveMessagePromise = data;
      });
      tick();
      expect((service as any).buildResponse).toHaveBeenCalledTimes(2);
      expect(service.messagesDb.bulkDocs).toHaveBeenCalledWith(
        messages.map((message: Message) => {
          return (service as any).buildResponse(message);
        }));
    }));

    it('should call the upsert when a single message is passed', fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve());
      let saveMessagePromise: any;
      service.saveMessages(MOCK_MESSAGE).subscribe((data: any) => {
        saveMessagePromise = data;
      });
      tick();
      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe(MOCK_MESSAGE.id);
    }));
  });

  describe('saveMetaInformation', () => {
    beforeEach(fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();
    }));

    it('should be called with the new date when a NEW_MESSAGE event is emitted', () => {
      spyOn(service, 'saveMetaInformation');
      const msg = new Message('someId', CONVERSATION_ID, 'test', OTHER_USER_ID, new Date());
      const newMeta = {
        start: msg.date.toISOString(),
        last: null
      };

      eventService.emit(EventService.NEW_MESSAGE, msg);

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

  describe('setPhoneNumber', () => {
    beforeEach(fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();
    }));

    it('should upsert the phone number information', fakeAsync(() => {
      service.setPhoneNumber('+34912345678').subscribe();
      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe('phone');
    }));
  });

  describe('getPhoneNumber', () => {
    it('should return the phone number from the database', () => {
      spyOn(service.messagesDb, 'get');

      service.getPhoneNumber();

      expect(service.messagesDb.get).toHaveBeenCalledWith('phone');
    });
  });

  describe('updateMessageDate', () => {
    beforeEach(fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();
    }));

    it('should update the date of an existing message', fakeAsync(() => {
      service.updateMessageDate(MOCK_MESSAGE).subscribe();
      tick();
      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe(MOCK_MESSAGE.id);
    }));
  });

  describe('getMetaInformation', () => {
    it('should return the meta information from the database', () => {
      spyOn(service.messagesDb, 'get');
      service.getMetaInformation();
      expect(service.messagesDb.get).toHaveBeenCalledWith('meta');
    });
  });

  describe('updateMessageStatus', () => {
    it('should upsert the message status', fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();

      service.updateMessageStatus(MOCK_MESSAGE, messageStatus.READ).subscribe();
      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe(MOCK_MESSAGE.id);
    }));
  });

  describe('markPhoneRequestAnswered', () => {
    beforeEach(fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();
    }));

    it('should update the status of an existing phoneRequest message', fakeAsync(() => {
      const phoneRequestMsg = new Message(MOCK_MESSAGE.id, CONVERSATION_ID, 'some text', USER_ID, new Date());
      phoneRequestMsg.phoneRequest = phoneRequestState.pending;

      service.markPhoneRequestAnswered(phoneRequestMsg).subscribe();
      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe(MOCK_MESSAGE.id);
    }));
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

  describe('findMessage', () => {
    it('should return the message if found in the database', () => {
      spyOn(service.messagesDb, 'get');

      service.findMessage('someId');

      expect(service.messagesDb.get).toHaveBeenCalledWith('someId');
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

