import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { SubscriptionsHttpService } from './subscriptions-http.service';
import { CAN_UPDATE_SUBSCRIPTION, SUBSCRIPTIONS_V3_ENDPOINT } from './endpoints';
import { CAN_SUBSCRIPTION_BE_EDITED_OK_DTO, MOCK_RESPONSE_V3_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionsV3Response } from '../dtos/subscriptions/subscription-response.interface';
import { CanEditSubscriptionResponseDto } from '@core/subscriptions/dtos/subscriptions/can-edit.subscription.interface';

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

  describe('when asked to retrieve if tier can be selected', () => {
    it('should retrieve information', () => {
      let response: CanEditSubscriptionResponseDto;
      const expectedTierId = '123';
      const expectedSubscriptionId = '456';

      service
        .canUpdateSubscription(expectedSubscriptionId, expectedTierId)
        .subscribe((res: CanEditSubscriptionResponseDto) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${CAN_UPDATE_SUBSCRIPTION(expectedSubscriptionId)}?tier_id=${expectedTierId}`);
      req.flush(CAN_SUBSCRIPTION_BE_EDITED_OK_DTO);

      expect(response).toEqual(CAN_SUBSCRIPTION_BE_EDITED_OK_DTO);
    });
  });
});
