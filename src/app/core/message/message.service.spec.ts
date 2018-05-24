/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { Message } from './message';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { createMessagesArray, MESSAGE_MAIN } from '../../../tests/message.fixtures.spec';
import {
  CONVERSATION_DATE_ISO,
  CONVERSATION_ID,
  MOCK_CONVERSATION
} from '../../../tests/conversation.fixtures.spec';
import {
  MOCK_DB_FILTERED_RESPONSE,
  MOCK_DB_META,
  MockedPersistencyService
} from '../../../tests/persistency.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { ConnectionService } from '../connection/connection.service';

describe('Service: Message', () => {

  let xmpp: XmppService;
  let service: MessageService;
  let persistencyService: PersistencyService;
  let userService: UserService;
  let connectionService: ConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        XmppService,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: ConnectionService, useValue: {}},
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: UserService, useValue: {user: new User(USER_ID)}}
      ]
    });
    xmpp = TestBed.get(XmppService);
    service = TestBed.get(MessageService);
    persistencyService = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    connectionService = TestBed.get(ConnectionService);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  describe('getMessages', () => {

    let conversation: Conversation;

    beforeEach(() => {
      conversation = MOCK_CONVERSATION();
    });

    describe('with data', () => {
      let response: any;

      beforeEach(() => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_FILTERED_RESPONSE));
      });

      it('should return data from the database if exists', () => {
        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });
        expect(response.meta.first).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc._id);
        expect(response.meta.last).toBe(MOCK_DB_FILTERED_RESPONSE[1].doc._id);
        expect(response.meta.end).toBe(true);
        expect(response.data.length).toBe(MOCK_DB_FILTERED_RESPONSE.length);
        expect(response.data[0] instanceof Message).toBe(true);
        expect(response.data[0].id).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc._id);
        expect(response.data[0].message).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc.message);
      });

      it('should return at least 1 message', () => {
        service.getMessages(conversation, 1).subscribe((data: any) => {
          response = data;
        });
        expect(response.data.length >= 1).toBe(true);
      });

      it('should call addUserInfoToArray', () => {
        const MESSAGES: Message[] = createMessagesArray(2);
        spyOn(service, 'addUserInfoToArray').and.returnValue(MESSAGES);
        service.getMessages(conversation, 1).subscribe((data: any) => {
          response = data;
        });
        expect(service.addUserInfoToArray).toHaveBeenCalled();
        expect(response.meta.first).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc._id);
        expect(response.meta.last).toBe(MOCK_DB_FILTERED_RESPONSE[1].doc._id);
        expect(response.meta.end).toBe(true);
        expect(response.data).toEqual(MESSAGES);
      });

    });

    it('should call the query method if there are not messages in the db', () => {
      xmpp.connect('1', 'token');
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(service, 'query').and.returnValue(Observable.of({
        meta: null,
        data: []
      }));
      service.getMessages(conversation).subscribe();
      expect(service.query).toHaveBeenCalledWith(conversation.id, conversation.lastMessageRef, -1);
    });
  });

  describe('query', () => {

    let conversation: Conversation;

    describe('backward', () => {

      it('should do recursive calls until the end of records', () => {
        spyOn(xmpp, 'searchHistory').and.callFake((conversationId: string, lastConversation: string) => {
          switch (lastConversation) {
            case '1':
              return Observable.of({
                data: createMessagesArray(24),
                meta: {
                  first: '2',
                  end: false
                }
              });
            case '2':
              return Observable.of({
                data: createMessagesArray(0),
                meta: {
                  first: '3',
                  end: false
                }
              });
            case '3':
              return Observable.of({
                data: createMessagesArray(26),
                meta: {
                  first: '4',
                  end: false
                }
              });
            case '4':
              return Observable.of({
                data: createMessagesArray(5),
                meta: {
                  first: '5',
                  end: true
                }
              });
          }
        });
        conversation = MOCK_CONVERSATION();
        conversation.lastMessageRef = '1';
        let res: any;
        service.query(conversation.id, conversation.lastMessageRef).subscribe((data: any) => {
          res = data;
        });
        expect(res.data.length).toBe(55);
        expect(res.meta.end).toBe(true);
        expect(res.meta.first).toBe('5');
      });

      it('should do recursive calls until it has at least 8 records', () => {
        spyOn(xmpp, 'searchHistory').and.callFake((conversationId: string, lastConversation: string) => {
          switch (lastConversation) {
            case '1':
              return Observable.of({
                data: createMessagesArray(4),
                meta: {
                  first: '2',
                  end: false
                }
              });
            case '2':
              return Observable.of({
                data: createMessagesArray(3),
                meta: {
                  first: '3',
                  end: false
                }
              });
            case '3':
              return Observable.of({
                data: createMessagesArray(0),
                meta: {
                  first: '4',
                  end: false
                }
              });
            case '4':
              return Observable.of({
                data: createMessagesArray(2),
                meta: {
                  first: '5',
                  end: false
                }
              });
            case '5':
              return Observable.of({
                data: createMessagesArray(2),
                meta: {
                  first: '6',
                  end: true
                }
              });
          }
        });
        conversation = MOCK_CONVERSATION();
        conversation.lastMessageRef = '1';
        let res: any;
        service.query(conversation.id, conversation.lastMessageRef, 8).subscribe((data: any) => {
          res = data;
        });
        expect(res.data.length).toBe(9);
        expect(res.meta.end).toBe(false);
        expect(res.meta.first).toBe('5');
      });

    });

    describe('forward', () => {

      it('should do recursive calls until the end of records', () => {
        spyOn(xmpp, 'searchHistory').and.callFake((conversationId: string, lastConversation: string) => {
          switch (lastConversation) {
            case '1':
              return Observable.of({
                data: createMessagesArray(13),
                meta: {
                  last: '2',
                  end: false
                }
              });
            case '2':
              return Observable.of({
                data: createMessagesArray(0),
                meta: {
                  last: '3',
                  end: false
                }
              });
            case '3':
              return Observable.of({
                data: createMessagesArray(7),
                meta: {
                  last: '4',
                  end: true
                }
              });
          }
        });
        conversation = MOCK_CONVERSATION();
        conversation.lastMessageRef = '1';
        let res: any;
        service.query(conversation.id, conversation.lastMessageRef, -1, CONVERSATION_DATE_ISO).subscribe((data: any) => {
          res = data;
        });
        expect(res.data.length).toBe(20);
        expect(res.meta.end).toBe(true);
        expect(res.meta.last).toBe('4');
      });

      it('should do recursive calls until it has at least 8 records', () => {
        spyOn(xmpp, 'searchHistory').and.callFake((conversationId: string, lastConversation: string) => {
          switch (lastConversation) {
            case '1':
              return Observable.of({
                data: createMessagesArray(4),
                meta: {
                  last: '2',
                  end: false
                }
              });
            case '2':
              return Observable.of({
                data: createMessagesArray(3),
                meta: {
                  last: '3',
                  end: false
                }
              });
            case '3':
              return Observable.of({
                data: createMessagesArray(0),
                meta: {
                  last: '4',
                  end: false
                }
              });
            case '4':
              return Observable.of({
                data: createMessagesArray(2),
                meta: {
                  last: '5',
                  end: false
                }
              });
            case '5':
              return Observable.of({
                data: createMessagesArray(2),
                meta: {
                  last: '6',
                  end: false
                }
              });
          }
        });
        conversation = MOCK_CONVERSATION();
        conversation.lastMessageRef = '1';
        let res: any;
        service.query(conversation.id, conversation.lastMessageRef, 8, CONVERSATION_DATE_ISO).subscribe((data: any) => {
          res = data;
        });
        expect(res.data.length).toBe(9);
        expect(res.meta.end).toBe(false);
        expect(res.meta.last).toBe('5');
      });

    });

  });

  describe('send', () => {

    it('should call the send message', () => {
      spyOn(xmpp, 'sendMessage');
      const conversation: Conversation = MOCK_CONVERSATION();
      service.send(conversation, 'text');
      expect(xmpp.sendMessage).toHaveBeenCalledWith(conversation, 'text');
    });

  });

  describe('getNotSavedMessages', () => {
    beforeEach(() => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.of(MOCK_DB_META));
    });
    describe('with connection', () => {
      beforeEach(() => {
        connectionService.isConnected = true;
      });

      it('should get the meta information from the database', () => {
        service.getNotSavedMessages();
        expect(persistencyService.getMetaInformation).toHaveBeenCalled();
      });

      it('should call the query method using the provide information of the db', () => {
        const messagesArray: Array<Message> = createMessagesArray(5);
        spyOn(service, 'query').and.returnValue(Observable.of({data: messagesArray, meta: MOCK_DB_META.data}));
        service.getNotSavedMessages().subscribe();
        expect(service.query).toHaveBeenCalledWith(null, MOCK_DB_META.data.last, -1, MOCK_DB_META.data.start);
      });

      it('should call the query method using the provide information of the db', () => {
        const messagesArray: Array<Message> = createMessagesArray(5);
        spyOn(service, 'query').and.returnValue(Observable.of({data: messagesArray, meta: MOCK_DB_META.data}));
        service.getNotSavedMessages().subscribe();
        expect(service.query).toHaveBeenCalledWith(null, MOCK_DB_META.data.last, -1, MOCK_DB_META.data.start);

      });

      it('should save the new meta information if the query returns messages', () => {
        const messagesArray: Array<Message> = createMessagesArray(5);
        spyOn(service, 'query').and.returnValue(Observable.of({data: messagesArray, meta: MOCK_DB_META.data}));
        spyOn(persistencyService, 'saveMetaInformation').and.returnValue(Observable.of({}));
        service.getNotSavedMessages().subscribe();
        expect(persistencyService.saveMetaInformation).toHaveBeenCalledWith(
          {last: MOCK_DB_META.data.last, start: messagesArray[messagesArray.length - 1].date.toISOString()}
        );
      });

      it('should NOT save the new meta information if the query does not return messages', () => {
        spyOn(service, 'query').and.returnValue(Observable.of({data: [], meta: MOCK_DB_META.data}));
        spyOn(persistencyService, 'saveMetaInformation').and.returnValue(Observable.of({}));
        service.getNotSavedMessages().subscribe();
        expect(persistencyService.saveMetaInformation).not.toHaveBeenCalled();
      });
    });

    describe('without connection', () => {
      it('should NOT call getMetaInformation when there is no connection', () => {
        connectionService.isConnected = false;

        service.getNotSavedMessages();

        expect(persistencyService.getMetaInformation).not.toHaveBeenCalled();
      });
    });

  });

  describe('addUserInfo', () => {

    const BUYER_ID = 'buyerId';
    let conversation: Conversation;

    beforeEach(() => {
      conversation = MOCK_CONVERSATION('1', BUYER_ID);
    });

    it('should add buyer user to message', () => {
      const message: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        BUYER_ID + '@domain'
      );
      service.addUserInfo(conversation, message);
      expect(message.user).toEqual(conversation.user);
      expect(message.fromBuyer).toBe(true);
    });

    it('should add seller user to message', () => {
      let message: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        USER_ID + '@domain'
      );
      message = service.addUserInfo(conversation, message);
      expect(message.user).toEqual(userService.user);
      expect(message.fromBuyer).toBe(false);
    });

  });

  describe('addUserInfoToArray', () => {

    it('should add user object to each message', () => {
      let messages: Message[] = createMessagesArray(4);
      const conversation: Conversation = MOCK_CONVERSATION();
      messages = service.addUserInfoToArray(conversation, messages);
      messages.forEach((message: Message) => {
        expect(message.user).toBeDefined();
      });
    });

  });

  describe('totalUnreadMessages', () => {

    it('should notify changes when totalUnreadMessages change', () => {
      let changedValue: number;
      const VALUE = 100;
      service.totalUnreadMessages$.subscribe((totalUnreadMessages: number) => {
        changedValue = totalUnreadMessages;
      });
      service.totalUnreadMessages = VALUE;
      expect(changedValue).toBe(VALUE);
      expect(service.totalUnreadMessages).toBe(VALUE);
    });

  });

  describe('resetCache', () => {
    it('should reset unread messages', () => {
      service.totalUnreadMessages = 5;
      service.resetCache();
      expect(service.totalUnreadMessages).toBe(0);
    });
  });

});
