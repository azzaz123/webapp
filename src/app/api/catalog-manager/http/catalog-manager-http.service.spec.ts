import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { ITEMS_BY_SUBSCRIPTION_TYPE_ENDPOINT, SUBSCRIPTIONS_SLOTS_ENDPOINT } from './endpoints';
import { CatalogManagerHttpService } from './catalog-manager-http.service';
import { SubscriptionSlotGeneralResponse } from '../dtos/slots/slots-response.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ItemBySubscriptionResponse } from '../dtos/slots/items-subscription-type.interface';
import { MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE } from '@fixtures/subscription-slots.fixtures.spec';

describe('CatalogHttpService', () => {
  let service: CatalogManagerHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogManagerHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogManagerHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('when asked to retrieve subscription slots', () => {
    it('should retrieve subscription slots', () => {
      let response: SubscriptionSlotGeneralResponse;

      service.getSlots().subscribe((res: SubscriptionSlotGeneralResponse) => (response = res));

      const req: TestRequest = httpMock.expectOne(SUBSCRIPTIONS_SLOTS_ENDPOINT);
      req.flush(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE);

      expect(response).toEqual(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('when asked to retrieve items by subscription type', () => {
    it('should retrieve items', () => {
      let response: ItemBySubscriptionResponse[];
      const init = 0;
      const offset = 20;
      const type = SUBSCRIPTION_CATEGORY_TYPES.CARS;
      const status = STATUS.ACTIVE;

      service.getItemsBySubscriptionType(init, offset, type, status).subscribe((res: ItemBySubscriptionResponse[]) => (response = res));

      const req: TestRequest = httpMock.expectOne(
        `${ITEMS_BY_SUBSCRIPTION_TYPE_ENDPOINT}?status=${status}&init=${init}&end=${init + offset}&type=${type}`
      );
      req.flush([]);

      expect(response).toEqual([]);
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('init')).toEqual(init.toString());
      expect(req.request.params.get('end')).toEqual((init + offset).toString());
      expect(req.request.params.get('type')).toEqual(type);
      expect(req.request.params.get('status')).toEqual(status);
    });
  });
});
