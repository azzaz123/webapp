import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT } from '@api/bff/delivery/buyer/http/endpoints';
import { DeliveryBuyerDeliveryMethodsDto } from '@api/bff/delivery/buyer/dtos';
import { DeliveryBuyerHttpService } from '@api/bff/delivery/buyer/http/delivery-buyer-http.service';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';

describe('DeliveryBuyerHttpService', () => {
  let service: DeliveryBuyerHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryBuyerHttpService],
    });
    service = TestBed.inject(DeliveryBuyerHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the costs information', () => {
    it('should get the corresponding information', () => {
      let response: DeliveryBuyerDeliveryMethodsDto;
      const itemId: string = 'the_item_id';

      service.getDeliveryMethods(itemId).subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_BUYER_DELIVERY_METHODS_ENDPOINT(itemId));
      req.flush(MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE);
    });
  });
});
