import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { PayviewDeliveryEventType } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.interface';
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
      const subscription = service.on(PayviewDeliveryEventType.DeliveryMethodSelected, (deliveryMethod: DeliveryBuyerDeliveryMethod) => {
        subscription.unsubscribe();
        result = deliveryMethod;
      });

      service.setDeliveryMethod(expected);

      expect(result).toStrictEqual(expected);
    }));
  });

  describe('WHEN edit the address', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PayviewDeliveryEventType.OpenAddressScreen, () => {
        subscription.unsubscribe();
        result++;
      });

      service.editAddress();

      expect(result).toBe(expected);
    }));
  });

  describe('WHEN edit the pick-up point', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PayviewDeliveryEventType.OpenPickUpPointMap, () => {
        subscription.unsubscribe();
        result++;
      });

      service.editPickUpPoint();

      expect(result).toBe(expected);
    }));
  });
});
