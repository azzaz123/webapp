/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { XmppService } from '../xmpp/xmpp.service';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus, phoneRequestState } from './message';
import { Observable } from 'rxjs';
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
  MOCK_DB_RESPONSE_WITH_OLD_PENDING,
  MOCK_DB_MSG_WITH_PHONEREQUEST
} from '../../../tests/persistency.fixtures.spec';
import { USER_ID, OTHER_USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveService } from './archive.service';
import { HttpService } from '../http/http.service';
import { I18nService } from '../i18n/i18n.service';
import { RealTimeService } from './real-time.service';
import { RemoteConsoleService } from '../remote-console';
import { MockRemoteConsoleService } from '../../../tests';

describe('Service: Message', () => {

  let realTime: RealTimeService;
  let service: MessageService;
  let persistencyService: PersistencyService;
  let userService: UserService;
  let connectionService: ConnectionService;
  let archiveService: MsgArchiveService;
  let trackingService: TrackingService;
  let httpService: HttpService;
  let i18n: I18nService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        XmppService,
        EventService,
        I18nService,
        MsgArchiveService,
        RealTimeService,
        {
          provide: HttpService, useValue: {
            get() {
            }
          }
        },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ConnectionService, useValue: {} },
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: UserService, useValue: { user: new User(USER_ID) } },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
      ]
    });
    realTime = TestBed.get(RealTimeService);
    service = TestBed.get(MessageService);
    persistencyService = TestBed.get(PersistencyService);
    userService = TestBed.get(UserService);
    connectionService = TestBed.get(ConnectionService);
    archiveService = TestBed.get(MsgArchiveService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    httpService = TestBed.get(HttpService);
    i18n = TestBed.get(I18nService);
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
      spyOn(realTime, 'sendDeliveryReceipt');
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

    describe('when messages have a phoneRequest property', () => {
      let response: any;
      it('should add the phoneRequest property to the message if it exists in the Db doc', () => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_MSG_WITH_PHONEREQUEST));

        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(response.data[0].phoneRequest).toBeTruthy();
      });

      it('should NOT add the phoneRequest property to the message if it does NOT exists in the Db doc', () => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_FILTERED_RESPONSE));

        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        response.data.forEach(m => {
          expect(m.phoneRequest).toBeFalsy();
        });
      });
    });

    describe('when messages with the status PENDING exist in the localDb', () => {
      let response: any;

      it('should not resend messages that have the status PENDING and are older than 5 days', () => {
        spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(MOCK_DB_RESPONSE_WITH_OLD_PENDING));
        spyOn(realTime, 'resendMessage');

        service.getMessages(conversation).subscribe((data: any) => {
          response = data;
        });

        expect(realTime.resendMessage).not.toHaveBeenCalled();
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
  });

  describe('getNotSavedMessages', () => {
    let conversations = createConversationsArray(3);
    const timestamp = new Date(MOCK_DB_META.data.start);
    const messagesArray: Array<Message> = createMessagesArray(5);
    beforeEach(() => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.of(MOCK_DB_META));
      spyOn(realTime, 'sendDeliveryReceipt');
    });
    describe('with connection', () => {
      beforeEach(() => {
        connectionService.isConnected = true;
      });

      it('should emit a CHAT_CAN_PROCESS_RT event with FALSE after it retrieves the meta information', () => {
        spyOn(eventService, 'emit');
        spyOn(archiveService, 'getEventsSince').and.callFake(() => []);
        service.getNotSavedMessages(conversations, false).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, false);
      });

      it('should emit a CHAT_CAN_PROCESS_RT event with TRUE after archiveService.getEventsSince returns', () => {
        spyOn(eventService, 'emit');
        spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
          messages: messagesArray,
          receivedReceipts: [],
          readReceipts: []
        }));
        service.getNotSavedMessages(conversations, false).subscribe();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_CAN_PROCESS_RT, true);
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
          conversations[0]['_id'] = messagesArray[0].thread;
        });

        it('should set statuses to READ for all new messages of an ARCHIVED conversation which are NOT fromSelf', () => {
          conversations[0].archived = true;

          service.getNotSavedMessages(conversations, true).subscribe();

          conversations[0].messages.map(msg => {
            expect(msg.status).toBe(messageStatus.READ);
          });
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
          clonedMockDbResponse.map(msg => msg.thread = messagesArray[0].thread);
          spyOn(persistencyService, 'getMessages').and.returnValue(Observable.of(clonedMockDbResponse));
          spyOn(archiveService, 'getEventsSince').and.returnValue(Observable.of({
            messages: messagesArray,
            receivedReceipts: receivedReceipts,
            readReceipts: [],
            metaDate: timestamp
          }));
          conversations = createConversationsArray(1);
          conversations[0]['_id'] = messagesArray[0].thread;
          service.getMessages(conversations[0]).subscribe(r => existingMessages = r.data);
          newAndOldMessages = existingMessages.concat(messagesArray);
        });

        it('should call archiveService.updateStatuses with all existing and new messages and receipts', () => {
          spyOn(archiveService, 'updateStatuses').and.callThrough();

          service.getNotSavedMessages(conversations, false).subscribe();

          expect(archiveService.updateStatuses).toHaveBeenCalledWith(newAndOldMessages, [], receivedReceipts);
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
        BUYER_ID
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
        USER_ID
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
        USER_ID,
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
      spyOn(realTime, 'sendMessage');
      const conversation: Conversation = MOCK_CONVERSATION();
      service.send(conversation, 'text');
      expect(realTime.sendMessage).toHaveBeenCalledWith(conversation, 'text');
    });
  });

  describe('addPhoneNumberRequestMessage', () => {
    let conversation: Conversation;

    beforeEach(() => {
      conversation = MOCK_CONVERSATION();
    });

    it('should create a phoneRequest message with the phoneRequestState as PENDING', () => {
      service.addPhoneNumberRequestMessage(conversation);
      conversation.messages.push(new Message('123', conversation.id, 'test', USER_ID));
      const requestMessage = conversation.messages.find(m => !!m.phoneRequest);

      expect(requestMessage.phoneRequest).toBe(phoneRequestState.pending);
    });

    it('should add the phone request message to the conversation', () => {
      const msgExistsBefore = conversation.messages.find(m => !!m.phoneRequest);

      service.addPhoneNumberRequestMessage(conversation);
      const requestMessage = conversation.messages.find(m => !!m.phoneRequest);

      expect(msgExistsBefore).toBeFalsy();
      expect(requestMessage instanceof Message).toBe(true);
    });

    it('should track the CHAT_SHAREPHONE_OPENSHARING event when no second argument is passed', () => {
      spyOn(trackingService, 'addTrackingEvent');

      service.addPhoneNumberRequestMessage(conversation);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_OPENSHARING });
    });

    it('should track the CHAT_SHAREPHONE_OPENSHARING event when the second argument is true', () => {
      spyOn(trackingService, 'addTrackingEvent');

      service.addPhoneNumberRequestMessage(conversation, true);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_OPENSHARING });
    });

    it('should NOT track the CHAT_SHAREPHONE_OPENSHARING event when the second argument is false', () => {
      spyOn(trackingService, 'addTrackingEvent');

      service.addPhoneNumberRequestMessage(conversation, false);

      expect(trackingService.addTrackingEvent).not.toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_OPENSHARING });
    });
  });

  describe('createPhoneNumberMessage', () => {
    const phone = '+34912345678';
    const conversation = MOCK_CONVERSATION();

    beforeEach(() => {
      spyOn(realTime, 'sendMessage');
      service.addPhoneNumberRequestMessage(conversation);
    });

    it('should call realTime.sendMessage with the new message', () => {
      const phoneMsg: any = i18n.getTranslations('phoneMessage') + phone;

      service.createPhoneNumberMessage(conversation, phone);

      expect(realTime.sendMessage).toHaveBeenCalledWith(conversation, phoneMsg);
    });

    it('should set phoneRequestState to ANSWERED for the phoneRequest message', () => {
      const requestMessage = conversation.messages.find(m => !!m.phoneRequest);

      service.createPhoneNumberMessage(conversation, phone);

      expect(requestMessage.phoneRequest).toBe(phoneRequestState.answered);
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
