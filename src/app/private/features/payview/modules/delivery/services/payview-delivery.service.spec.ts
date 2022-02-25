import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
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
      const expected = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.current;

      const subscription = service.deliveryMethodSelected.subscribe((deliveryMethod: DeliveryBuyerDeliveryMethod) => {
        subscription.unsubscribe();
        expect(deliveryMethod).toStrictEqual(expected);
      });

      service.setDeliveryMethod(expected);
    }));
  });
});
