import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { SubscriptionsHttpService } from './subscriptions-http.service';
import { SubscriptionsV3Response } from '../subscriptions.interface';
import { SUBSCRIPTIONS_V3_ENDPOINT } from './endpoints';
import { MOCK_RESPONSE_V3_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';

describe('SubscriptionsHttpService', () => {
  let service: SubscriptionsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionsHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SubscriptionsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('when asked to retrieve user subscriptions', () => {
    it('should retrieve subscriptions', () => {
      let response: SubscriptionsV3Response[];

      service.get().subscribe((res: SubscriptionsV3Response[]) => (response = res));

      const req: TestRequest = httpMock.expectOne(SUBSCRIPTIONS_V3_ENDPOINT);
      req.flush(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

      expect(response).toEqual(MOCK_RESPONSE_V3_SUBSCRIPTIONS);
    });
  });
});
