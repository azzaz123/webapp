import { TestBed } from '@angular/core/testing';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { InboxConversation, InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { of, throwError } from 'rxjs';
import { MockConnectionService, MockRemoteConsoleService } from '../../../tests';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE,
  MOCK_INBOX_CONVERSATION,
  CONVERSATION_ID,
  MOCKED_CONVERSATIONS,
  MOCK_CONVERSATION,
} from '@fixtures/chat';
import { ACCESS_TOKEN, MOCK_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  SendFirstMessage,
} from '../analytics/analytics-constants';
import { AnalyticsService } from '../analytics/analytics.service';
import { ConnectionService } from '../connection/connection.service';
import { EventService } from '../event/event.service';
import { I18nService } from '../i18n/i18n.service';
import { RemoteConsoleService } from '../remote-console';
import { XmppService } from '../xmpp/xmpp.service';
import { Message } from './message';
import { RealTimeService } from './real-time.service';
import { DeliveryRealTimeService } from '@private/core/services/delivery-real-time/delivery-real-time.service';
import { ChatTrackingEventsService } from './chat-tracking-events/chat-tracking-events.service';
import { SearchIdService } from '@core/analytics/search/search-id/search-id.service';

let service: RealTimeService;
let eventService: EventService;
let xmppService: XmppService;
let remoteConsoleService: RemoteConsoleService;
let analyticsService: AnalyticsService;
let connectionService: ConnectionService;
let i18nService: I18nService;
let chatTrackingEventsService: ChatTrackingEventsService;

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: DeliveryRealTimeService, useValue: {} },
        I18nService,
        ChatTrackingEventsService,
        SearchIdService,
      ],
    });

    service = TestBed.inject(RealTimeService);
    eventService = TestBed.inject(EventService);
    xmppService = TestBed.inject(XmppService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    analyticsService = TestBed.inject(AnalyticsService);
    connectionService = TestBed.inject(ConnectionService);
    i18nService = TestBed.inject(I18nService);
    chatTrackingEventsService = TestBed.inject(ChatTrackingEventsService);
  });

  describe('connect', () => {
    beforeEach(() => {
      spyOn(remoteConsoleService, 'sendConnectionTimeout').and.callThrough();
      spyOn(remoteConsoleService, 'sendChatConnectionTime');
    });

    it('should not call xmpp.connect if user is connected', () => {
      connectionService.isConnected = true;
      xmppService['clientConnected'] = true;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));
      spyOn(xmppService, 'isConnected$').and.returnValue(of(true));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendConnectionTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendChatConnectionTime).not.toHaveBeenCalled();
    });

    it('should call xmpp.connect and return success', () => {
      connectionService.isConnected = true;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).toHaveBeenCalledWith(MOCK_USER.id, ACCESS_TOKEN);
      expect(remoteConsoleService.sendConnectionTimeout).toHaveBeenCalled();
      expect(remoteConsoleService.sendChatConnectionTime).toHaveBeenCalledWith('xmpp', true);
    });

    it('should not call xmpp.connect and return failed', () => {
      connectionService.isConnected = true;
      spyOn(xmppService, 'connect$').and.returnValue(throwError(''));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).toHaveBeenCalledWith(MOCK_USER.id, ACCESS_TOKEN);
      expect(remoteConsoleService.sendConnectionTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendChatConnectionTime).toHaveBeenCalledWith('xmpp', false);
    });

    it('should NOT call xmpp.connect if user do not have internet connection', () => {
      connectionService.isConnected = false;
      service['isConnectingWithXMPP'] = false;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendConnectionTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendChatConnectionTime).not.toHaveBeenCalled();
    });

    it('should NOT call xmpp.connect if is already connected', () => {
      connectionService.isConnected = true;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).toHaveBeenCalled();
      expect(remoteConsoleService.sendConnectionTimeout).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should call xmpp.disconnect', () => {
      spyOn(xmppService, 'disconnect');

      service.disconnect();

      expect(xmppService.disconnect).toHaveBeenCalled();
    });
  });

  describe('reconnect', () => {
    it('should call reconnect with recursivly FALSE if it is disconnected when a CONNECTION_RESTORED event is triggered', () => {
      spyOn(service, 'reconnect');

      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(service.reconnect).toHaveBeenCalledWith(false);
    });

    it('should call xmpp.reconnectClient if called with recursivly = false', () => {
      spyOn(xmppService, 'reconnectClient');

      service.reconnect(false);

      expect(xmppService.reconnectClient).toHaveBeenCalled();
    });

    describe('recursivly', () => {
      it('should call xmpp.reconnectClient if ongoingRetry is FALSE, and set ongoingRetry to TRUE', () => {
        spyOn(xmppService, 'reconnectClient');
        service['ongoingRetry'] = false;

        service.reconnect(true);

        expect(xmppService.reconnectClient).toHaveBeenCalled();
        expect(service['ongoingRetry']).toBe(true);
      });

      it('should NOT call xmpp.reconnectClient f ongoingRetry is TRUE', () => {
        spyOn(xmppService, 'reconnectClient');
        service['ongoingRetry'] = true;

        service.reconnect(true);

        expect(xmppService.reconnectClient).not.toHaveBeenCalled();
      });

      it('should reset ongoingRetry to FALSE when xmpp.disconnectError return TRUE', () => {
        spyOn(xmppService, 'disconnectError').and.returnValue(of(true));
        spyOn(xmppService, 'reconnectClient');
        service['ongoingRetry'] = false;

        service.reconnect(true);

        expect(service['ongoingRetry']).toBe(false);
      });

      it('should keep ongoingRetry to TRUE when xmpp.disconnectError throws and error', () => {
        spyOn(xmppService, 'disconnectError').and.returnValue(throwError(xmppService['xmppError']));
        spyOn(xmppService, 'reconnectClient');
        service['ongoingRetry'] = true;

        service.reconnect(true);

        expect(service['ongoingRetry']).toBe(true);
      });
    });
  });

  describe('sendMessage', () => {
    it('should call xmpp.sendMessage', () => {
      spyOn(xmppService, 'sendMessage');

      service.sendMessage(MOCK_CONVERSATION(), MOCK_INBOX_CONVERSATION.message);

      expect(xmppService.sendMessage).toHaveBeenCalledWith(MOCK_CONVERSATION(), MOCK_INBOX_CONVERSATION.message);
    });
  });

  describe('resendMessage', () => {
    it('should call xmpp.resendMessage', () => {
      spyOn(xmppService, 'resendMessage');

      service.resendMessage(MOCK_CONVERSATION(), MOCK_INBOX_CONVERSATION);

      expect(xmppService.resendMessage).toHaveBeenCalledWith(MOCK_CONVERSATION(), MOCK_INBOX_CONVERSATION);
    });
  });

  describe('sendReceivedReceipt', () => {
    it('should call xmpp.sendMessageDeliveryReceipt when called', () => {
      spyOn(xmppService, 'sendMessageDeliveryReceipt');

      service.sendDeliveryReceipt(MOCK_USER.id, MOCK_INBOX_CONVERSATION.id, MOCK_CONVERSATION().id);

      expect(xmppService.sendMessageDeliveryReceipt).toHaveBeenCalledWith(MOCK_USER.id, MOCK_INBOX_CONVERSATION.id, MOCK_CONVERSATION().id);
    });
  });

  describe('sendRead', () => {
    it('should call xmpp.sendConversationStatus when called', () => {
      spyOn(xmppService, 'sendConversationStatus');

      service.sendRead(MOCK_USER.id, MOCK_CONVERSATION().id);

      expect(xmppService.sendConversationStatus).toHaveBeenCalledWith(MOCK_USER.id, MOCK_CONVERSATION().id);
    });
  });

  describe('subscribeEventNewMessage', () => {
    it('should NOT call sendDeliveryReceipt if the new message is fromSelf', () => {
      spyOn(service, 'sendDeliveryReceipt');
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = true;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });

    it(`should NOT call sendDeliveryReceipt if a NEW_MESSAGE event is emitted without the deliveryReceipt parameter,
      or with the deliveryRecipt parameter set to FALSE`, () => {
      spyOn(service, 'sendDeliveryReceipt');
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, false);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();

      eventService.emit(EventService.NEW_MESSAGE, msg);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });

    it('should NOT call sendDeliveryReceipt if the message already exists', () => {
      spyOn(service, 'sendDeliveryReceipt');
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });
  });

  describe('subscribeEventChatMessageSent', () => {
    describe('if it`s the first message', () => {
      let inboxMessage;
      let inboxConversation;

      beforeEach(() => {
        inboxMessage = new InboxMessage(
          'someId',
          'conversationId',
          'some text',
          USER_ID,
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
        inboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();

        inboxConversation.messages.push(inboxMessage);
      });

      it('should ask for first message event tracking', () => {
        spyOn(chatTrackingEventsService, 'trackSendFirstMessage');

        eventService.emit(EventService.MESSAGE_SENT, inboxConversation, 'newMsgId');

        expect(chatTrackingEventsService.trackSendFirstMessage).toHaveBeenCalledWith(inboxConversation);
      });
    });

    describe('if it`s not the first message', () => {
      it('should not ask for first message event tracking', () => {
        MOCKED_CONVERSATIONS[0].messages = [MOCK_INBOX_CONVERSATION, MOCK_INBOX_CONVERSATION];
        spyOn(chatTrackingEventsService, 'trackSendFirstMessage');

        eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

        expect(chatTrackingEventsService.trackSendFirstMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe('addPhoneNumberMessageToConversation', () => {
    const phone = '+34912345678';
    const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();

    beforeEach(() => {
      spyOn(service, 'sendMessage');
    });

    it('should add the phone number as a message to the conversation', () => {
      const phoneMsg = `${i18nService.translate(TRANSLATION_KEY.CHAT_MY_PHONE_NUMBER)} ${phone}`;

      service.addPhoneNumberMessageToConversation(inboxConversation, phone);
      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(service.sendMessage).toHaveBeenCalledWith(inboxConversation, phoneMsg);
    });

    describe('when the conversation has no messages', () => {
      beforeEach(() => (inboxConversation.messages = []));

      it('should ask for first message event tracking', () => {
        spyOn(chatTrackingEventsService, 'trackSendFirstMessage');

        service.addPhoneNumberMessageToConversation(inboxConversation, phone);
        const inboxMessage = new InboxMessage(
          'newMsgId',
          inboxConversation.id,
          phone,
          USER_ID,
          true,
          new Date(),
          MessageStatus.SENT,
          MessageType.TEXT
        );
        inboxConversation.messages.push(inboxMessage);
        eventService.emit(EventService.MESSAGE_SENT, inboxConversation, 'newMsgId');

        expect(chatTrackingEventsService.trackSendFirstMessage).toHaveBeenCalledWith(inboxConversation);
      });
    });
  });
});
