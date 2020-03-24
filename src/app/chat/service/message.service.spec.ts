/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { XmppService } from '../../core/xmpp/xmpp.service';
import { Conversation } from '../../core/conversation/conversation';
import { Message } from '../../core/message/message';
import { EventService } from '../../core/event/event.service';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { createMessagesArray, MESSAGE_MAIN } from '../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ConnectionService } from '../../core/connection/connection.service';
import { HttpService } from '../../core/http/http.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { RealTimeService } from '../../core/message/real-time.service';
import { RemoteConsoleService } from '../../core/remote-console';
import { MockRemoteConsoleService } from '../../../tests';
import { InboxConversation, MessageStatus } from '../model';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';

describe('Service: Message', () => {

  let realTime: RealTimeService;
  let service: MessageService;
  let persistencyService: PersistencyService;
  let userService: UserService;
  let connectionService: ConnectionService;
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
        MessageStatus.RECEIVED,
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
      const conversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
      service.send(conversation, 'text');
      expect(realTime.sendMessage).toHaveBeenCalledWith(conversation, 'text');
    });
  });

  describe('addPhoneNumberRequestMessage', () => {
    let conversation: InboxConversation;

    beforeEach(() => {
      conversation = CREATE_MOCK_INBOX_CONVERSATION();
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
  });
});