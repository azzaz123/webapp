import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { MOCK_BUYER_REQUESTS } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { MOCK_DELIVERY_ITEM_DETAILS } from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import { MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { of } from 'rxjs';
import { ActionableDeliveryBanner } from '../../../delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '../../../delivery-banner/interfaces/descriptive-delivery-banner.interface';

import { DeliveryConversationContextAsBuyerService } from './delivery-conversation-context-as-buyer.service';

describe('DeliveryConversationContextAsBuyerService', () => {
  let service: DeliveryConversationContextAsBuyerService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let deliveryItemDetailsApiService: DeliveryItemDetailsApiService;

  const MOCK_ITEM_HASH: string = 'abcd';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryConversationContextAsBuyerService,
        { provide: BuyerRequestsApiService, useValue: { getRequestsAsBuyerByItemHash: () => of(null) } },
        { provide: DeliveryItemDetailsApiService, useValue: { getDeliveryDetailsByItemHash: (_itemHash: string) => of(null) } },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsBuyerService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    deliveryItemDetailsApiService = TestBed.inject(DeliveryItemDetailsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for buyer context', () => {
    describe('when buyer has done previously buy requests to current item', () => {
      beforeEach(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUESTS));
      });

      it('should hide banner', fakeAsync(() => {
        service.getBannerPropertiesAsBuyer(MOCK_ITEM_HASH).subscribe((result) => {
          expect(result).toBeFalsy();
        });
        tick();
      }));
    });

    describe('when buyer has 0 requests to current item', () => {
      beforeEach(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([]));
      });

      describe('and server responses with buy cost price', () => {
        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
        });

        it('should show buy bunner with price', fakeAsync(() => {
          const expectedBanner: DescriptiveDeliveryBanner & ActionableDeliveryBanner = {
            svgPath: MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES.svgPath,
            description: {
              text: `Shipping available for ${MOCK_DELIVERY_ITEM_DETAILS.minimumPurchaseCost}`,
              helpLink: MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES.description.helpLink,
            },
            action: MOCK_DELIVERY_BANNER_BUY_NOW_PROPERTIES.action,
          };

          service.getBannerPropertiesAsBuyer(MOCK_ITEM_HASH).subscribe((result) => {
            expect(result).toEqual(expectedBanner);
          });
          tick();
        }));
      });
    });
  });
});
