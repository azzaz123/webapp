import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryBuyerHttpService } from '@api/bff/delivery/buyer/http/delivery-buyer-http.service';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import {
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS,
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE,
} from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';

import { of } from 'rxjs';

describe('DeliveryBuyerService', () => {
  let service: DeliveryBuyerService;
  let deliveryCostsHttpService: DeliveryBuyerHttpService;
  const fakeItemHash: string = 'this_is_a_fake_item_hash';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryBuyerService, DeliveryBuyerHttpService],
    });
    service = TestBed.inject(DeliveryBuyerService);
    deliveryCostsHttpService = TestBed.inject(DeliveryBuyerHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the costs for an item', () => {
    beforeEach(() => {
      spyOn(deliveryCostsHttpService, 'getDeliveryMethods').and.returnValue(of(MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE));
    });

    it('should get the costs for this specific item', () => {
      service.getDeliveryMethods(fakeItemHash).subscribe();

      expect(deliveryCostsHttpService.getDeliveryMethods).toHaveBeenCalled();
      expect(deliveryCostsHttpService.getDeliveryMethods).toHaveBeenCalledWith(fakeItemHash);
    });

    it('should map server response to web context', () => {
      let response: DeliveryBuyerDeliveryMethods;

      service.getDeliveryMethods(fakeItemHash).subscribe((data) => (response = data));

      expect(response).toMatchObject(MOCK_DELIVERY_BUYER_DELIVERY_METHODS);
    });
  });
});
