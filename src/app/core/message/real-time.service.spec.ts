import { TestBed } from '@angular/core/testing';
import { RealTimeService } from './real-time.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import { Observable } from 'rxjs';
import { Message, phoneRequestState } from './message';
import { ACCESS_TOKEN, MOCK_USER, OTHER_USER_ID, USER_ID } from '../../../tests/user.fixtures.spec';
import { CONVERSATION_ID, MOCK_CONVERSATION, MOCKED_CONVERSATIONS } from '../../../tests/conversation.fixtures.spec';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { environment } from '../../../environments/environment.docker';
import { RemoteConsoleService } from '../remote-console';

export class MockRemoteConsoleService {
  sendConnectionTimeout(userId: string, timeout: number): void {
  }
}

let service: RealTimeService;
let persistencyService: PersistencyService;
let eventService: EventService;
let xmppService: XmppService;
let trackingService: TrackingService;
let remoteConsoleService: RemoteConsoleService;

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        { provide: PersistencyService, useClass: MockedPersistencyService },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
      ]
    });

    service = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
    persistencyService = TestBed.get(PersistencyService);
    xmppService = TestBed.get(XmppService);
    trackingService = TestBed.get(TrackingService);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    appboy.initialize(environment.appboy);
  });

  describe('connect', () => {
    it('should call xmpp.connect', () => {
      spyOn(xmppService, 'connect').and.returnValue(Observable.of({}));
      spyOn(remoteConsoleService, 'sendConnectionTimeout').and.callThrough();

      service.connect(MOCK_USER.id, ACCESS_TOKEN);

      expect(xmppService.connect).toHaveBeenCalledWith(MOCK_USER.id, ACCESS_TOKEN);
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
        spyOn(xmppService, 'disconnectError').and.returnValue(Observable.of(true));
        spyOn(xmppService, 'reconnectClient');
        service['ongoingRetry'] = false;

        service.reconnect(true);

        expect(service['ongoingRetry']).toBe(false);
      });

      it('should keep ongoingRetry to TRUE when xmpp.disconnectError throws and error', () => {
        spyOn(xmppService, 'disconnectError').and.returnValue(Observable.throw(xmppService['xmppError']));
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
    it(`should call sendDeliveryReceipt when a NEW_MESSAGE event is emitted for a message that requests the delivery
    and is NOT fromSelf`, () => {
      spyOn(service, 'sendDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.throw({
        reason: 'missing'
      }));
      const msg = new Message('someId', CONVERSATION_ID, 'from other', OTHER_USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).toHaveBeenCalledWith(msg.from, msg.id, msg.thread);
    });

    it('should NOT call sendDeliveryReceipt if the new message is fromSelf', () => {
      spyOn(service, 'sendDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.throw({
        reason: 'missing'
      }));
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = true;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });

    it(`should NOT call sendDeliveryReceipt if a NEW_MESSAGE event is emitted without the deliveryReceipt parameter,
      or with the deliveryRecipt parameter set to FALSE`, () => {
      spyOn(service, 'sendDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.throw({
        reason: 'missing'
      }));
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, false);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();

      eventService.emit(EventService.NEW_MESSAGE, msg);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });

    it('should NOT call sendDeliveryReceipt if the message already exists (persistencyService.findMessage returns a value)', () => {
      spyOn(service, 'sendDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.of({}));
      const msg = new Message('someId', CONVERSATION_ID, 'from myself!', USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).not.toHaveBeenCalled();
    });
  });

  describe('subscribeEventChatMessageSent', () => {

    it('should emit a CONV_WITH_PHONE_CREATED event when the MESSAGE_SENT event is triggered, if a hasPhoneRequestMessage exists', () => {
      spyOn<any>(eventService, 'emit').and.callThrough();
      const conv = MOCKED_CONVERSATIONS[0];
      const phoneRequestMsg = new Message('someId', conv.id, 'some text', USER_ID, new Date());
      phoneRequestMsg.phoneRequest = phoneRequestState.pending;
      conv.messages.push(phoneRequestMsg);

      eventService.emit(EventService.MESSAGE_SENT, conv, MOCK_MESSAGE.id);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONV_WITH_PHONE_CREATED, conv, phoneRequestMsg);
    });

    it('should call addTrackingEvent with the conversationCreateNew event when the MESSAGE_SENT event is triggered', () => {
      spyOn(trackingService, 'addTrackingEvent');
      const newConversation = MOCK_CONVERSATION('newId');
      newConversation.messages.push(MOCK_MESSAGE);
      const expectedEvent: TrackingEventData = {
        eventData: TrackingService.CONVERSATION_CREATE_NEW,
        attributes: {
          thread_id: newConversation.id,
          message_id: MOCK_MESSAGE.id,
          item_id: newConversation.item.id
        }
      };

      eventService.emit(EventService.MESSAGE_SENT, newConversation, MOCK_MESSAGE.id);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(expectedEvent, false);
    });

    it('should call addTrackingEvent with the facebook InitiateCheckout event when the MESSAGE_SENT event is triggered', () => {
      spyOn(window, 'fbq');
      const newConversation = MOCK_CONVERSATION('newId');
      newConversation.messages.push(MOCK_MESSAGE);
      const event = {
        value: newConversation.item.salePrice,
        currency: newConversation.item.currencyCode,
      };

      eventService.emit(EventService.MESSAGE_SENT, newConversation, MOCK_MESSAGE.id);

      expect(window['fbq']).toHaveBeenCalledWith('track', 'InitiateCheckout', event);
    });

    it('should add MessageSent event in the pendingTrackingEvents queue when the MESSAGE_SENT event is triggered', () => {
      spyOn(trackingService, 'addTrackingEvent');
      const conv = MOCK_CONVERSATION('newId');
      const expectedEvent: TrackingEventData = {
        eventData: TrackingService.MESSAGE_SENT,
        attributes: {
          thread_id: conv.id,
          message_id: MOCK_MESSAGE.id
        }
      };

      eventService.emit(EventService.MESSAGE_SENT, conv, MOCK_MESSAGE.id);

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(expectedEvent, false);
    });

    it('should call appboy.logCustomEvent if this is the first message message sent', () => {
      spyOn(appboy, 'logCustomEvent');
      MOCKED_CONVERSATIONS[0].messages.push(MOCK_MESSAGE);

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('FirstMessage', { platform: 'web' });
    });

    it('should not call appboy.logCustomEvent if the conversation is not empty (has messages)', () => {
      spyOn(appboy, 'logCustomEvent');
      MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE, MOCK_MESSAGE];

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).not.toHaveBeenCalled();
    });
  });
});
