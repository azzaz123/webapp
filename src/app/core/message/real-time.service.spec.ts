import { TestBed, inject } from '@angular/core/testing';
import { RealTimeService } from './real-time.service';
import { XmppService } from '../xmpp/xmpp.service';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { Observable } from 'rxjs/Observable';
import { Message } from './message';
import { USER_ID, OTHER_USER_ID } from '../../../tests/user.fixtures.spec';
import { CONVERSATION_ID } from '../../../tests/conversation.fixtures.spec';

let service: RealTimeService;
let persistencyService: PersistencyService;
let eventService: EventService;

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeService,
        XmppService,
        EventService,
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: TrackingService, useValue: {}}
      ]
    });

    service = TestBed.get(RealTimeService);
    eventService = TestBed.get(EventService);
    persistencyService = TestBed.get(PersistencyService);
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
});
