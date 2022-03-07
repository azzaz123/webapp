import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';

describe('PayviewDeliveryService', () => {
  let service: PayviewDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayviewDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN set a delivery method', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: DeliveryBuyerDeliveryMethod;
      const expected = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;
      const subscription = service.on(
        PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED,
        (deliveryMethod: DeliveryBuyerDeliveryMethod) => {
          subscription.unsubscribe();
          result = deliveryMethod;
        }
      );

      service.setDeliveryMethod(expected);
      tick();

      expect(result).toStrictEqual(expected);
    }));
  });

  describe('WHEN edit the address', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {
        subscription.unsubscribe();
        result++;
      });

      service.editAddress();
      tick();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN edit the pick-up point', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {
        subscription.unsubscribe();
        result++;
      });

      service.editPickUpPoint();
      tick();

      expect(result).toBe(expected);
    }));
  });
});
