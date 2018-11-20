/* tslint:disable:no-unused-variable */
import * as _ from 'lodash';
import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus } from './message';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import {
  createMessagesArray, createReceivedReceiptsArray,
  MESSAGE_MAIN, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER
} from '../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION, createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import {
  MOCK_DB_FILTERED_RESPONSE,
  MOCK_DB_META,
  MockedPersistencyService,
  MOCK_DB_RESPONSE_WITH_PENDING,
  MOCK_DB_RESPONSE_WITH_OLD_PENDING
} from '../../../tests/persistency.fixtures.spec';
import { USER_ID, OTHER_USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveService } from './archive.service';
import { HttpService } from '../http/http.service';

describe('Service: Message', () => {

  let xmpp: XmppService;
  let service: MessageService;
  let persistencyService: PersistencyService;
  let userService: UserService;
  let connectionService: ConnectionService;
  let archiveService: MsgArchiveService;
  let trackingService: TrackingService;
  let httpService: HttpService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        XmppService,
        EventService,
        MsgArchiveService,
        { provide: HttpService, useValue: { get() { } } },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ConnectionService, useValue: {} },
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: UserService, useValue: { user: new User(USER_ID) } }
      ]
    });
    xmpp = TestBed.get(XmppService);
    service = TestBed.get(MessageService);
    persistencyService = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    connectionService = TestBed.get(ConnectionService);
    archiveService = TestBed.get(MsgArchiveService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    httpService = TestBed.get(HttpService);
  });

  it('should instanciate', () => {
    expect(service).toBeTruthy();
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

  describe('getMessages', () => {

    let conversation: Conversation;
    const nanoTimestamp = (new Date(MOCK_DB_META.data.start).getTime() / 1000) + '000';

    beforeEach(() => {
      spyOn(xmpp, 'sendMessageDeliveryReceipt');
      conversation = MOCK_CONVERSATION();
    });

    describe('when messages exist in the localDb', () => {
      let response: any;

      beforeEach(() => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_FILTERED_RESPONSE));
      });

      it('should emit FOUND_MESSAGES_IN_DB event if messages exit in the database', () => {
        spyOn(eventService, 'emit');

        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(eventService.emit).toHaveBeenCalledWith(EventService.FOUND_MESSAGES_IN_DB);

      });

      it('should return data from the database if it exists', () => {
        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(response.data.length).toBe(MOCK_DB_FILTERED_RESPONSE.length);
        expect(response.data[0] instanceof Message).toBe(true);
        expect(response.data[0].id).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc._id);
        expect(response.data[0].message).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc.message);
      });

      it('should return at least 1 message', () => {
        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });
        expect(response.data.length >= 1).toBe(true);
      });

      it('should call addUserInfoToArray', () => {
        const MESSAGES: Message[] = createMessagesArray(2);

        spyOn(service, 'addUserInfoToArray').and.returnValue(MESSAGES);
        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(service.addUserInfoToArray).toHaveBeenCalled();
        expect(response.data).toEqual(MESSAGES);
      });
    });

    describe('when messages with the status PENDING exist in the localDb', () => {
      let response: any;
      let pendingMsg;

      it('should resend messages that have the status PENDING and is newer than 5 days', () => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_RESPONSE_WITH_PENDING));
        spyOn(xmpp, 'sendMessage');
        const pendingMsgCount = MOCK_DB_RESPONSE_WITH_PENDING.filter(m => m.doc.status === messageStatus.PENDING).length;


        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
          pendingMsg = response.data[0];
        });

        expect(xmpp.sendMessage).toHaveBeenCalledTimes(pendingMsgCount);
        expect(xmpp.sendMessage).toHaveBeenCalledWith(conversation, pendingMsg.message, true, pendingMsg.id);
      });

      it('should not resend messages that have the status PENDING and are older than 5 days', () => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_RESPONSE_WITH_OLD_PENDING));
        spyOn(xmpp, 'sendMessage');

        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(xmpp.sendMessage).not.toHaveBeenCalled();
      });
    });

    it('should call the archiveService.getAllEvents when there are no messages in the localDb AND there is internet connection', () => {
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({ messages: [] }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expect(archiveService.getAllEvents).toHaveBeenCalledWith(conversation.id);
    });

    it('should set status to READ for all mesasges fromSelf, when parameter archived is true', () => {
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER],
        receivedReceipts: [],
        readReceipts: []
      }));
      conversation.archived = true;
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe(r => {
        expect(r.data[1].status).toBe(messageStatus.READ);
      });
    });

    it('should call persistencyService.saveMessages and .saveMetaInformation to save the new messages and meta in the localDb', () => {
      spyOn(persistencyService, 'saveMessages');
      spyOn(persistencyService, 'saveMetaInformation');
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: [MESSAGE_MAIN, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER],
        receivedReceipts: [],
        readReceipts: [],
        metaDate: nanoTimestamp
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expect(persistencyService.saveMessages).toHaveBeenCalledWith([MESSAGE_MAIN, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER]);
      expect(persistencyService.saveMetaInformation).toHaveBeenCalledWith({
        start: nanoTimestamp,
        last: null
      });
    });
  });

  describe('getNotSavedMessages', () => {
    let conversations = createConversationsArray(3);
    const timestamp = new Date(MOCK_DB_META.data.start);
    const messagesArray: Array<Message> = createMessagesArray(5);
    beforeEach(() => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.of(MOCK_DB_META));
      spyOn(xmpp, 'sendMessageDeliveryReceipt');
    });
    describe('with connection', () => {
      beforeEach(() => {
        connectionService.isConnected = true;
      });

      it('should emit a MSG_ARCHIVE_LOADING event after it retrieves the meta information', () => {
        spyOn(eventService, 'emit');
        spyOn(archiveService, 'getEventsSince').and.callFake(() => []);
        service.getNotSavedMessages(conversations, false).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.MSG_ARCHIVE_LOADING);
      });

      it('should emit a MSG_ARCHIVE_LOADED event after archiveService.getEventsSince returns', () => {
        spyOn(eventService, 'emit');
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
          messages: messagesArray,
          receivedReceipts: [],
          readReceipts: []
        }));
        service.getNotSavedMessages(conversations, false).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.MSG_ARCHIVE_LOADED);
      });

      it('should get the meta information from the database', () => {
        service.getNotSavedMessages(conversations, false);

        expect(persistencyService.getMetaInformation).toHaveBeenCalled();
      });

      it('should call archiveService.getEventsSince using the timestamp provided from the db', () => {
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
          messages: messagesArray,
          receivedReceipts: [],
          readReceipts: []
        }));

        service.getNotSavedMessages(conversations, true).subscribe();

        expect(archiveService.getEventsSince).toHaveBeenCalledWith(MOCK_DB_META.data.start);
      });

      it('should call persistencyService.saveMetaInformation with the metaDate provided in the response', () => {
        spyOn(persistencyService, 'saveMetaInformation');
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
          messages: [],
          receivedReceipts: [],
          readReceipts: [],
          metaDate: timestamp
        }));

        service.getNotSavedMessages(conversations, true).subscribe();

        expect(persistencyService.saveMetaInformation).toHaveBeenCalledWith({ start: timestamp, last: null });
      });

      describe('with response that contains new messages', () => {
        beforeEach(() => {
          messagesArray.map(m => m.fromSelf = false);
          spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
            messages: messagesArray,
            receivedReceipts: [],
            readReceipts: [],
            metaDate: timestamp
          }));
          conversations = createConversationsArray(1);
          conversations[0]['_id'] = messagesArray[0].conversationId;
        });

        it('should set statuses to READ for all new messages of an ARCHIVED conversation which are NOT fromSelf', () => {
          conversations[0].archived = true;

          service.getNotSavedMessages(conversations, true).subscribe();

          conversations[0].messages.map(msg => {
            expect(msg.status).toBe(messageStatus.READ);
          });
        });

        it(`should sendMessageDeliveryReceipt for messages from the response, that don't have a corresponding receivedReceipt`, () => {
          service.getNotSavedMessages(conversations, false).subscribe();

          expect(xmpp.sendMessageDeliveryReceipt).toHaveBeenCalledTimes(messagesArray.length);
          messagesArray.map(msg => {
            expect(xmpp.sendMessageDeliveryReceipt).toHaveBeenCalledWith(msg.from, msg.id, msg.conversationId);
          });
        });

        it('should call persistencyService.saveMessages with the new messages from the response', () => {
          spyOn(persistencyService, 'saveMessages');

          service.getNotSavedMessages(conversations, false).subscribe();

          expect(persistencyService.saveMessages).toHaveBeenCalledWith(messagesArray);
        });
      });

      describe('with response that contains receipts', () => {
        const receivedReceipts = createReceivedReceiptsArray(3);
        let existingMessages;
        let newAndOldMessages;

        beforeEach(() => {
          messagesArray.map(m => m['_from'] = OTHER_USER_ID);
          messagesArray.map(m => m.status = messageStatus.RECEIVED);
          const clonedMockDbResponse = JSON.parse(JSON.stringify(MOCK_DB_FILTERED_RESPONSE));
          clonedMockDbResponse.map(msg => msg.thread = messagesArray[0].conversationId);
          spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(clonedMockDbResponse));
          spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
            messages: messagesArray,
            receivedReceipts: receivedReceipts,
            readReceipts: [],
            metaDate: timestamp
          }));
          conversations = createConversationsArray(1);
          conversations[0]['_id'] = messagesArray[0].conversationId;
          service.getMessages(conversations[0]).subscribe(r => existingMessages = r.data);
          newAndOldMessages = existingMessages.concat(messagesArray);
        });

        it('should call archiveService.updateStatuses with all existing and new messages and receipts', () => {
          spyOn(archiveService, 'updateStatuses').and.callThrough();

          service.getNotSavedMessages(conversations, false).subscribe();

          expect(archiveService.updateStatuses).toHaveBeenCalledWith(newAndOldMessages, [], receivedReceipts);
        });

        it('should call persistencyService.updateMessageStatus for each old and new message', () => {
          spyOn(persistencyService, 'updateMessageStatus');

          service.getNotSavedMessages(conversations, false).subscribe();

          newAndOldMessages.map(msg => {
            expect(persistencyService.updateMessageStatus).toHaveBeenCalledWith(msg, msg.status);
          });
        });

        it('should update unreadMessages counter and the totalUnreadMessages counter if the conversation is NOT archived', () => {
          conversations[0].archived = false;
          service.getNotSavedMessages(conversations, false).subscribe();

          expect(conversations[0].unreadMessages).toBe(messagesArray.length);
          expect(service.totalUnreadMessages).toBe(messagesArray.length);
        });

        it('should NOT update unreadMessages counter and the totalUnreadMessages counter if the conversation is archived', () => {
          conversations[0].archived = true;
          service.getNotSavedMessages(conversations, true).subscribe();

          expect(conversations[0].unreadMessages).toBe(0);
          expect(service.totalUnreadMessages).toBe(0);
        });
      });
    });

    describe('without connection', () => {
      it('should NOT call getMetaInformation when there is no connection', () => {
        connectionService.isConnected = false;

        service.getNotSavedMessages(conversations, true);

        expect(persistencyService.getMetaInformation).not.toHaveBeenCalled();
      });
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

  describe('addUserInfo', () => {

    const BUYER_ID = 'buyerId';
    let conversation: Conversation;

    beforeEach(() => {
      conversation = MOCK_CONVERSATION('1', BUYER_ID);
    });

    it('should add the user info and set fromSelf to FALSE when the message.user is the same as conversation.user', () => {
      const message: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        BUYER_ID + '@domain'
      );

      service.addUserInfo(conversation, message);

      expect(message.user).toEqual(conversation.user);
      expect(message.fromSelf).toBe(false);
    });

    it('should add the user info and set fromSelf to TRUE when the message.user is the same as logged in user (userService.user)', () => {
      let message: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        USER_ID + '@domain'
      );

      message = service.addUserInfo(conversation, message);

      expect(message.user).toEqual(userService.user);
      expect(message.fromSelf).toBe(true);
    });

    it('should add the user info and set fromSelf to FALSE when the message is a third voice (has payload)', () => {
      let message: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        USER_ID + '@domain',
        new Date(),
        messageStatus.RECEIVED,
        { text: 'someText', type: 'someType' }
      );

      message = service.addUserInfo(conversation, message);

      expect(message.user).toEqual(userService.user);
      expect(message.fromSelf).toBe(false);
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

  describe('resetCache', () => {
    it('should reset unread messages', () => {
      service.totalUnreadMessages = 5;
      service.resetCache();
      expect(service.totalUnreadMessages).toBe(0);
    });
  });

});
