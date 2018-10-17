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
import { createMessagesArray, MESSAGE_MAIN, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER } from '../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
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
import { MockArchiveService, createMockMessagesArray } from '../../../tests/archive.fixture.spec';

describe('Service: Message', () => {

  let xmpp: XmppService;
  let service: MessageService;
  let persistencyService: PersistencyService;
  let userService: UserService;
  let connectionService: ConnectionService;
  let archiveService: MsgArchiveService;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        XmppService,
        EventService,
        {provide: MsgArchiveService, useClass: MockArchiveService},
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
    archiveService = TestBed.get(MsgArchiveService);
    trackingService = TestBed.get(TrackingService);
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

    beforeEach(() => {
      spyOn(xmpp, 'sendMessageDeliveryReceipt');
      conversation = MOCK_CONVERSATION();
    });

    describe('when messages exist in the localDb', () => {
      let response: any;

      beforeEach(() => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_FILTERED_RESPONSE));
      });

      it('should return data from the database if it exists', () => {
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
        expect(response.meta.first).toBe(MOCK_DB_FILTERED_RESPONSE[0].doc._id);
        expect(response.meta.last).toBe(MOCK_DB_FILTERED_RESPONSE[1].doc._id);
        expect(response.meta.end).toBe(true);
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
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({messages: []}));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expect(archiveService.getAllEvents).toHaveBeenCalledWith(conversation.id, '0');
    });

    it('should set status to READ for all mesasges fromSelf, when parameter archived is true', () => {
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: [MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER],
        receivedReceipts: [],
        readReceipts: []
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation, true).subscribe(r => {
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
        readReceipts: []
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expect(persistencyService.saveMessages).toHaveBeenCalledWith([MESSAGE_MAIN, MOCK_RANDOM_MESSAGE, MOCK_MESSAGE_FROM_OTHER]);
      expect(persistencyService.saveMetaInformation).toHaveBeenCalledWith({
        last: MOCK_MESSAGE_FROM_OTHER.id,
        start: new Date(MOCK_MESSAGE_FROM_OTHER.date).toISOString()
      });
    });

    it(`should add clickstream events of RECEIVED_ACK and call xmpp.sendMessageDeliveryReceipt only for messages that
        are NOT fromSelf and don't have a receivedReceipt`, () => {
      const messageArray = createMockMessagesArray(8);
      spyOn(trackingService, 'addTrackingEvent');
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: messageArray,
        receivedReceipts: [],
        readReceipts: []
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      messageArray.map(m => {
        const event = {
          eventData: TrackingService.MESSAGE_RECEIVED_ACK,
          attributes: { thread_id: m.conversationId, message_id: m.id, item_id: conversation.item.id }
        };

        if (m.fromSelf) {
          expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith(event, false);
          expect(xmpp.sendMessageDeliveryReceipt).not.toHaveBeenCalledWith(m.from, m.id, m.conversationId);
        } else {
          expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(event, false);
          expect(xmpp.sendMessageDeliveryReceipt).toHaveBeenCalledWith(m.from, m.id, m.conversationId);
        }
      });
    });

    it(`should NOT add clickstream events of RECEIVED_ACK, nor call xmpp.sendMessageDeliveryReceipt for messages that
        are NOT fromSelf but already have a receivedReceipt`, () => {
      const messageArray = createMockMessagesArray(2);
      const messageNotFromSelf = messageArray[1];
      spyOn(trackingService, 'addTrackingEvent');
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: messageArray,
        receivedReceipts: [{
          thread: messageNotFromSelf.conversationId,
          messageId: messageNotFromSelf.id,
          from: messageNotFromSelf.from,
          to: OTHER_USER_ID,
          fromSelf: false,
          timestamp: new Date(messageNotFromSelf.date).getTime() + 1000
        }],
        readReceipts: []
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expect(xmpp.sendMessageDeliveryReceipt).not.toHaveBeenCalled();
      expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({
        eventData: TrackingService.MESSAGE_RECEIVED_ACK,
        attributes: { thread_id: messageNotFromSelf.conversationId, message_id: messageNotFromSelf.id, item_id: conversation.item.id }
      }, false);
    });

    it('should add clickstream events for the current and previous states, for messages that are fromSelf', () => {
      const messageArray = createMockMessagesArray(6);
      const expectedMessages = messageArray.filter(m => m.fromSelf);
      expectedMessages[0].status = messageStatus.SENT;
      expectedMessages[1].status = messageStatus.RECEIVED;
      expectedMessages[2].status = messageStatus.READ;

      spyOn(trackingService, 'addTrackingEvent');
      spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of([]));
      spyOn(archiveService, 'getAllEvents').and.returnValue(Observable.of({
        messages: messageArray,
        receivedReceipts: [],
        readReceipts: []
      }));
      connectionService.isConnected = true;

      service.getMessages(conversation).subscribe();

      expectedMessages.map((m, index) => {
        const attr = {
          thread_id: m.conversationId,
          message_id: m.id,
          item_id: conversation.item.id
        };

        switch (index) {
          case 0:
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_READ, attributes: attr}, false);
            break;
          case 1:
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_READ, attributes: attr}, false);
            break;
          case 2:
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attr}, false);
            expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({eventData: TrackingService.MESSAGE_READ, attributes: attr}, false);
            break;
        }
      });
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

      it('should call archiveService.getEventsSince using the timestamp provided from the db', () => {
        const messagesArray: Array<Message> = createMessagesArray(5);
        const nanoTimestamp = (new Date(MOCK_DB_META.data.start).getTime() / 1000) + '000';
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of(messagesArray));

        service.getNotSavedMessages().subscribe();

        expect(archiveService.getEventsSince).toHaveBeenCalledWith(nanoTimestamp);
      });

      xit('should save the new meta information if the query returns messages', () => {  // TODO - add tests when code for sinceArchive is implemented
        const messagesArray: Array<Message> = createMessagesArray(5);
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({data: messagesArray, meta: MOCK_DB_META.data}));
        spyOn(persistencyService, 'saveMetaInformation').and.returnValue(Observable.of({}));

        service.getNotSavedMessages().subscribe();

        expect(persistencyService.saveMetaInformation).toHaveBeenCalledWith(
          {last: MOCK_DB_META.data.last, start: messagesArray[messagesArray.length - 1].date.toISOString()}
        );
      });

      xit('should NOT save the new meta information if the query does not return messages', () => {  // TODO - add tests when code for sinceArchive is implemented
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({data: [], meta: MOCK_DB_META.data}));
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

    it('should add buyer user to message', () => {
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

    it('should add seller user to message', () => {
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
