import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { SUBSCRIPTIONS_SLOTS_ENDPOINT } from './endpoints';
import { CatalogManagerHttpService } from './catalog-manager-http.service';
import { SubscriptionSlotGeneralResponse } from '../dtos/slots/slots-response.interface';
import { MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE } from '@fixtures/subsctiption-slots.fixtures.spec';

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
    });
  });
});
