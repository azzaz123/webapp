import { TestBed, inject } from '@angular/core/testing';
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
import { USER_ID, OTHER_USER_ID } from '../../../tests/user.fixtures.spec';
import { CONVERSATION_ID, MOCK_CONVERSATION, MOCKED_CONVERSATIONS } from '../../../tests/conversation.fixtures.spec';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { environment } from '../../../environments/environment.docker';

let service: RealTimeService;
let persistencyService: PersistencyService;
let eventService: EventService;
let xmppService: XmppService;
let trackingService: TrackingService;

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useClass: MockTrackingService}
      ]
    });

    service = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
    persistencyService = TestBed.get(PersistencyService);
    xmppService = TestBed.get(XmppService);
    trackingService = TestBed.get(TrackingService);
    appboy.initialize(environment.appboy);
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
    it(`should call sendDeliveryReceipt when a NEW_MESSAGE event is emitted for a message that requests the delivery
    and is NOT fromSelf`, () => {
      spyOn(service, 'sendDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.throw({
        reason: 'missing'
      }));
      const msg = new Message('someId', CONVERSATION_ID, 'from other', OTHER_USER_ID);
      msg.fromSelf = false;

      eventService.emit(EventService.NEW_MESSAGE, msg, false, true);

      expect(service.sendDeliveryReceipt).toHaveBeenCalledWith(msg.from, msg.id, msg.conversationId);
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
      // @ts-ignore
      spyOn(window, 'fbq');
      const newConversation = MOCK_CONVERSATION('newId');
      const event = {
        value: newConversation.item.salePrice,
        currency:  newConversation.item.currencyCode,
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
      MOCKED_CONVERSATIONS[0].messages = [];

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('FirstMessage', {platform: 'web'});
    });

    it('should not call appboy.logCustomEvent if the conversation is already created', () => {
      spyOn(appboy, 'logCustomEvent');
      MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE];

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).not.toHaveBeenCalled();
    });

    it('should not call appboy.logCustomEvent if the conversation is not empty (has messages)', () => {
      spyOn(appboy, 'logCustomEvent');
      MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE];

      eventService.emit(EventService.MESSAGE_SENT, MOCKED_CONVERSATIONS[0], 'newMsgId');

      expect(appboy.logCustomEvent).not.toHaveBeenCalled();
    });
  });
});
