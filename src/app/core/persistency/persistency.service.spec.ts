/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PersistencyService } from './persistency.service';
import { createMessagesArray, MESSAGE_MAIN, MOCK_MESSAGE, MOCK_PAYLOAD_OK } from '../../../tests/message.fixtures.spec';
import { Message, messageStatus } from '../message/message';
import {
  MOCK_DB_FILTERED_RESPONSE,
  MOCK_DB_RESPONSE,
  MockedConversationsDb,
  MockedMessagesDb
} from '../../../tests/persistency.fixtures.spec';
import { CONVERSATION_DATE_ISO, CONVERSATION_ID } from '../../../tests/conversation.fixtures.spec';
import { Observable } from 'rxjs/Observable';

let service: PersistencyService;
const MOCK_REV = 'rev';
const MOCK_SAVE_DATA: any = {last: 'asdas', start: CONVERSATION_DATE_ISO};
const MOCK_UNREAD_MESSAGES = 5;

describe('Service: Persistency', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistencyService],
    });
    service = TestBed.get(PersistencyService);
    (service as any)['_messagesDb'] = new MockedMessagesDb();
    (service as any)['_conversationsDb'] = new MockedConversationsDb();
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
        from: MOCK_MESSAGE.from,
        conversationId: MOCK_MESSAGE.conversationId,
        payload: undefined
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
        from: MOCK_MESSAGE.from,
        conversationId: MOCK_MESSAGE.conversationId,
        payload: MOCK_PAYLOAD_OK
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

    it('should upsert the meta information', fakeAsync(() => {
      service.saveMetaInformation(MOCK_SAVE_DATA).subscribe();
      tick();
      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe('meta');
    }));
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

  describe('saveUnreadMessages', () => {
    it('should upsert the unread messages node', fakeAsync(() => {
      spyOn(service.conversationsDb, 'get').and.returnValue(Promise.resolve({
        _rev: MOCK_REV,
        data: MOCK_UNREAD_MESSAGES
      }));
      spyOn(service.conversationsDb, 'put').and.callThrough();
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      service.saveUnreadMessages(CONVERSATION_ID, MOCK_UNREAD_MESSAGES).subscribe();
      tick();
      expect(service['upsert']).toHaveBeenCalled();
    }));
  });

  describe('updateMessageStatus', () => {
    it('should upsert the message status', fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));
      tick();

      service.updateMessageStatus(MOCK_MESSAGE.id, messageStatus.READ).subscribe();
      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe(MOCK_MESSAGE.id);
    }));
  });

  describe('getDbVersion', () => {
    it('should return the database version information from the database', () => {
      spyOn(service.messagesDb, 'get');

      service['getDbVersion']();

      expect(service.messagesDb.get).toHaveBeenCalledWith('version');
    });
  });

  describe('saveDbVersion', () => {
    it('should upsert the database version information', fakeAsync(() => {
      spyOn<any>(service, 'upsert').and.returnValue(Promise.resolve({}));

      service['saveDbVersion']({}).subscribe();
      tick();

      expect((service as any).upsert).toHaveBeenCalled();
      expect((service as any).upsert.calls.allArgs()[0][0]).toBe(service.messagesDb);
      expect((service as any).upsert.calls.allArgs()[0][1]).toBe('version');
    }));
  });

  describe('localDbVersionUpdate', () => {
    beforeEach(() => {
      spyOn<any>(service, 'saveDbVersion');
    });
    it('should save the version when called with a version number greater than the current version number', () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.of({version: 1.0}));
      function mockCallback() {}

      service.localDbVersionUpdate(1.2, mockCallback);

      expect(service['getDbVersion']).toHaveBeenCalled();
      expect(service['saveDbVersion']).toHaveBeenCalled();
    });

    it('should save the version when the error reason is `missing`', () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.throw({reason: 'missing'}));
      function mockCallback() {}

      service.localDbVersionUpdate(1.2, mockCallback);

      expect(service['getDbVersion']).toHaveBeenCalled();
      expect(service['saveDbVersion']).toHaveBeenCalled();
    });

    it('should not save the version when the error message reason is not `missing`', () => {
      spyOn<any>(service, 'getDbVersion').and.returnValue(Observable.throw({reason: 'something else'}));
      function mockCallback() {}

      service.localDbVersionUpdate(1.2, mockCallback);

      expect(service['getDbVersion']).toHaveBeenCalled();
      expect(service['saveDbVersion']).not.toHaveBeenCalled();
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

