import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  MOCK_DELIVERY_WITH_PAYLOAD_NORMAL_XMPP_MESSAGE,
  MOCK_DELIVERY_WITHOUT_PAYLOAD_NORMAL_XMPP_MESSAGE,
  MOCK_UNKNOWN_NORMAL_XMPP_MESSAGE,
  MOCK_NORMAL_XMPP_MESSAGE_WITHOUT_PAYLOAD,
} from '@fixtures/chat/xmpp.fixtures.spec';
import { DeliveryRealTimeNotification } from './delivery-real-time-notification.interface';

import { DeliveryRealTimeService } from './delivery-real-time.service';

describe('DeliveryRealTimeService', () => {
  let service: DeliveryRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryRealTimeService],
    });
    service = TestBed.inject(DeliveryRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when handling a new normal XMPP message', () => {
    describe('and the message has content', () => {
      describe('and when the message is delivery related', () => {
        describe('and when the message content has more content', () => {
          it('should emit a valid notification', fakeAsync(() => {
            let result: DeliveryRealTimeNotification;
            const expectedNotification: DeliveryRealTimeNotification = {
              id: MOCK_DELIVERY_WITH_PAYLOAD_NORMAL_XMPP_MESSAGE.payload.type,
              payload: MOCK_DELIVERY_WITH_PAYLOAD_NORMAL_XMPP_MESSAGE.payload.payload,
            };
            service.deliveryRealTimeNotifications$.subscribe((notification) => (result = notification));

            service.check(MOCK_DELIVERY_WITH_PAYLOAD_NORMAL_XMPP_MESSAGE);
            tick();

            expect(result).toEqual(expectedNotification);
          }));
        });

        describe('and when the message content does NOT have more content', () => {
          it('should emit a valid notification', fakeAsync(() => {
            let result: DeliveryRealTimeNotification;
            const expectedNotification: DeliveryRealTimeNotification = {
              id: MOCK_DELIVERY_WITHOUT_PAYLOAD_NORMAL_XMPP_MESSAGE.payload.type,
            };
            service.deliveryRealTimeNotifications$.subscribe((notification) => (result = notification));

            service.check(MOCK_DELIVERY_WITHOUT_PAYLOAD_NORMAL_XMPP_MESSAGE);
            tick();

            expect(result).toEqual(expectedNotification);
          }));
        });
      });

      describe('and when the message is NOT delivery related', () => {
        it('should ignore it', fakeAsync(() => {
          let result: DeliveryRealTimeNotification;
          service.deliveryRealTimeNotifications$.subscribe((notification) => (result = notification));

          service.check(MOCK_UNKNOWN_NORMAL_XMPP_MESSAGE);
          tick();

          expect(result).toBeFalsy();
        }));
      });
    });

    describe('and the message has no content', () => {
      it('should ignore it', fakeAsync(() => {
        let result: DeliveryRealTimeNotification;
        service.deliveryRealTimeNotifications$.subscribe((notification) => (result = notification));

        service.check(MOCK_NORMAL_XMPP_MESSAGE_WITHOUT_PAYLOAD);
        tick();

        expect(result).toBeFalsy();
      }));
    });
  });
});
