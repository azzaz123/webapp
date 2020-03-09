import { TestBed } from '@angular/core/testing';
import { RealTimeService } from './real-time.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import { of, throwError } from 'rxjs';
import { Message } from './message';
import { ACCESS_TOKEN, MOCK_USER, OTHER_USER_ID, USER_ID } from '../../../tests/user.fixtures.spec';
import { CONVERSATION_ID, MOCK_CONVERSATION, MOCKED_CONVERSATIONS } from '../../../tests/conversation.fixtures.spec';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { environment } from '../../../environments/environment.docker';
import { RemoteConsoleService } from '../remote-console';
import { MockRemoteConsoleService, MockConnectionService } from '../../../tests';
import { AnalyticsService } from '../analytics/analytics.service';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  SendFirstMessage
} from '../analytics/analytics-constants';
import { ConnectionService } from '../connection/connection.service';
import { CREATE_MOCK_INBOX_CONVERSATION, CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE } from '../../../tests/inbox.fixtures.spec';
import { InboxConversation, InboxMessage, MessageStatus, MessageType, PhoneRequestState } from '../../chat/model';

let service: RealTimeService;
let eventService: EventService;
let xmppService: XmppService;
let trackingService: TrackingService;
let remoteConsoleService: RemoteConsoleService;
let analyticsService: AnalyticsService;
let connectionService: ConnectionService;

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ]
    });

    service = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
    xmppService = TestBed.get(XmppService);
    trackingService = TestBed.get(TrackingService);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    analyticsService = TestBed.get(AnalyticsService);
    connectionService = TestBed.get(ConnectionService);
    appboy.initialize(environment.appboy);
  });

  describe('connect', () => {
    beforeEach(() => {
      spyOn(remoteConsoleService, 'sendConnectionTimeout').and.callThrough();
    });

    it('should not call xmpp.connect if user is connected', () => {
      connectionService.isConnected = true;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));
      spyOn(xmppService, 'isConnected$').and.returnValue(of(true));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendConnectionTimeout).not.toHaveBeenCalled();
    });

    it('should call xmpp.connect and return success', () => {
      connectionService.isConnected = true;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).toHaveBeenCalledWith(MOCK_USER.id, ACCESS_TOKEN);
      expect(remoteConsoleService.sendConnectionTimeout).toHaveBeenCalled();
    });

    it('should NOT call xmpp.connect if user do not have internet connection', () => {
      connectionService.isConnected = false;
      service['isConnectingWithXMPP'] = false;
      spyOn(xmppService, 'connect$').and.returnValue(of({}));

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect$).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendConnectionTimeout).not.toHaveBeenCalled();
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

      service.sendMessage(MOCK_CONVERSATION(), MOCK_MESSAGE.message);

      expect(xmppService.sendMessage).toHaveBeenCalledWith(MOCK_CONVERSATION(), MOCK_MESSAGE.message);
    });
  });

  describe('resendMessage', () => {
    it('should call xmpp.resendMessage', () => {
      spyOn(xmppService, 'resendMessage');

      service.resendMessage(MOCK_CONVERSATION(), MOCK_MESSAGE);

      expect(xmppService.resendMessage).toHaveBeenCalledWith(MOCK_CONVERSATION(), MOCK_MESSAGE);
    });
  });

  describe('sendReceivedReceipt', () => {
    it('should call xmpp.sendMessageDeliveryReceipt when called', () => {
      spyOn(xmppService, 'sendMessageDeliveryReceipt');

      service.sendDeliveryReceipt(MOCK_USER.id, MOCK_MESSAGE.id, MOCK_CONVERSATION().id);

      expect(xmppService.sendMessageDeliveryReceipt).toHaveBeenCalledWith(MOCK_USER.id, MOCK_MESSAGE.id, MOCK_CONVERSATION().id);
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

    it('should emit a CONV_WITH_PHONE_CREATED event when the MESSAGE_SENT event is triggered, if a hasPhoneRequestMessage exists', () => {
      spyOn<any>(eventService, 'emit').and.callThrough();
      const inboxConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();
      const phoneRequestMsg = new InboxMessage('someId', inboxConversation.id, 'some text', USER_ID, true, new Date(), MessageStatus.SENT, MessageType.TEXT);
      phoneRequestMsg.phoneRequest = PhoneRequestState.PENDING;
      inboxConversation.messages.push(phoneRequestMsg);

      eventService.emit(EventService.MESSAGE_SENT, inboxConversation, MOCK_MESSAGE.id);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONV_WITH_PHONE_CREATED, inboxConversation, phoneRequestMsg);
    });

    it('should call track with the conversationCreateNew event when the MESSAGE_SENT event is triggered', () => {
      spyOn(trackingService, 'track');
      const newConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE('newId');
      const inboxMessage = new InboxMessage('someId', newConversation.id, 'some text', USER_ID, true, new Date(), MessageStatus.SENT, MessageType.TEXT);
      newConversation.messages.push(inboxMessage);

      eventService.emit(EventService.MESSAGE_SENT, newConversation, inboxMessage.id);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_CREATE_NEW, {
          thread_id: newConversation.id,
          message_id: inboxMessage.id,
          item_id: newConversation.item.id
        });
    });

    it('should call track with the facebook InitiateCheckout event when the MESSAGE_SENT event is triggered', () => {
      spyOn(window, 'fbq');
      const newConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE('newId');
      const inboxMessage = new InboxMessage('someId', newConversation.id, 'some text', USER_ID, true, new Date(),
        MessageStatus.SENT, MessageType.TEXT);
      newConversation.messages.push(inboxMessage);

      const event = {
        value: newConversation.item.price.amount,
        currency: newConversation.item.price.currency,
      };

      eventService.emit(EventService.MESSAGE_SENT, newConversation, newConversation.id);

      expect(window['fbq']).toHaveBeenCalledWith('track', 'InitiateCheckout', event);
    });

    it('should call pinterest checkout tracking with data', () => {
      spyOn(window, 'pintrk');
      const newConversation: InboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE('newId');
      const inboxMessage = new InboxMessage('someId', newConversation.id, 'some text', USER_ID, true, new Date(),
        MessageStatus.SENT, MessageType.TEXT);
      newConversation.messages.push(inboxMessage);
      const event = {
        value: newConversation.item.price.amount,
        currency: newConversation.item.price.currency,
        line_items: [
          {
            product_category: newConversation.item.categoryId,
            product_id: newConversation.item.id,
          }
        ]
      };

      eventService.emit(EventService.MESSAGE_SENT, newConversation, newConversation.id);

      expect(window['pintrk']).toHaveBeenCalledWith('track', 'checkout', event);
    });

    it('should add MessageSent event in the pendingTrackingEvents queue when the MESSAGE_SENT event is triggered', () => {
      spyOn(trackingService, 'track');
      const conv = CREATE_MOCK_INBOX_CONVERSATION('newId');

      eventService.emit(EventService.MESSAGE_SENT, conv, MOCK_MESSAGE.id);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_SENT, {
        thread_id: conv.id,
        message_id: MOCK_MESSAGE.id
      });
    });

    it('should call appboy.logCustomEvent if this is the first message message sent', () => {
      spyOn(appboy, 'logCustomEvent');
      const inboxMessage = new InboxMessage('someId', 'conversationId', 'some text', USER_ID, true, new Date(),
        MessageStatus.SENT, MessageType.TEXT);
      const conv = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();
      conv.messages.push(inboxMessage);

      eventService.emit(EventService.MESSAGE_SENT, conv, 'newMsgId');

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('FirstMessage', { platform: 'web' });
    });

    it('should not call appboy.logCustomEvent if the conversation is not empty (has messages)', () => {
      spyOn(appboy, 'logCustomEvent');
      MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE, MOCK_MESSAGE];

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).not.toHaveBeenCalled();
    });

    describe('if it`s the first message', () => {
      it('should send the Send First Message event', () => {
        const inboxMessage = new InboxMessage('someId', 'conversationId', 'some text', USER_ID, true, new Date(),
          MessageStatus.SENT, MessageType.TEXT);
        const inboxConversation = CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE();
        const expectedEvent: AnalyticsEvent<SendFirstMessage> = {
          name: ANALYTICS_EVENT_NAMES.SendFirstMessage,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: inboxConversation.item.id,
            sellerUserId: inboxConversation.user.id,
            conversationId: inboxConversation.id,
            screenId: SCREEN_IDS.Chat
          }
        };
        inboxConversation.messages.push(inboxMessage);
        spyOn(analyticsService, 'trackEvent');

        eventService.emit(EventService.MESSAGE_SENT, inboxConversation, 'newMsgId');

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('if it`s not the first message', () => {
      it('should not send the Send First Message event', () => {
        MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE, MOCK_MESSAGE];
        spyOn(analyticsService, 'trackEvent');

        eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

        expect(analyticsService.trackEvent).not.toHaveBeenCalled();
      });
    });
  });
});