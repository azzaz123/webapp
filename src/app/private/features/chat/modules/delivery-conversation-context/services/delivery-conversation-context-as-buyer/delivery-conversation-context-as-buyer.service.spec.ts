import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import {
  MOCK_BUYER_REQUESTS,
  MOCK_BUYER_REQUEST_ACCEPTED,
  MOCK_BUYER_REQUEST_EXPIRED,
} from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import {
  MOCK_DELIVERY_ITEM_DETAILS,
  MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE,
  MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED,
} from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';
import { MOCK_INBOX_CONVERSATION_AS_BUYER } from '@fixtures/chat';
import { MOCK_BUY_DELIVERY_BANNER_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of, BehaviorSubject } from 'rxjs';
import { ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DeliveryBannerTrackingEventsService } from '../../../delivery-banner/services/delivery-banner-tracking-events/delivery-banner-tracking-events.service';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DELIVERY_BANNER_TYPE } from '../../../delivery-banner/enums/delivery-banner-type.enum';
import { ActionableDeliveryBanner } from '../../../delivery-banner/interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../delivery-banner/interfaces/priceable-delivery-banner.interface';

import { DeliveryConversationContextAsBuyerService } from './delivery-conversation-context-as-buyer.service';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';

describe('DeliveryConversationContextAsBuyerService', () => {
  const featuresEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

  let service: DeliveryConversationContextAsBuyerService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let deliveryItemDetailsApiService: DeliveryItemDetailsApiService;
  let deliveryBannerTrackingEventsService: DeliveryBannerTrackingEventsService;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DeliveryConversationContextAsBuyerService,
        { provide: BuyerRequestsApiService, useValue: { getRequestsAsBuyerByItemHash: () => of(null) } },
        { provide: DeliveryItemDetailsApiService, useValue: { getDeliveryDetailsByItemHash: (_itemHash: string) => of(null) } },
        { provide: NgbModal, useValue: { open: () => {} } },
        {
          provide: DeliveryBannerTrackingEventsService,
          useValue: {
            trackClickBannerBuy() {},
          },
        },
        {
          provide: DeliveryExperimentalFeaturesService,
          useValue: {
            featuresEnabled$: featuresEnabledSubject.asObservable(),
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsBuyerService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    deliveryItemDetailsApiService = TestBed.inject(DeliveryItemDetailsApiService);
    deliveryBannerTrackingEventsService = TestBed.inject(DeliveryBannerTrackingEventsService);
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for buyer context', () => {
    describe('and when delivery feature flag is disabled', () => {
      beforeEach(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([MOCK_BUYER_REQUEST_EXPIRED]));
        spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
        featuresEnabledSubject.next(false);
      });

      it('should hide banner', fakeAsync(() => {
        let result: DeliveryBanner | null;

        service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((data) => (result = data));
        tick();

        expect(result).toBe(null);
      }));
    });

    describe('when buyer has done previously buy requests to current item', () => {
      describe('and when the last request is in a pending or accepted state', () => {
        beforeEach(() => {
          spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([MOCK_BUYER_REQUEST_ACCEPTED]));
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
          featuresEnabledSubject.next(true);
        });

        it('should hide banner', fakeAsync(() => {
          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
            expect(result).toBeFalsy();
          });
          tick();
        }));
      });

      describe('and when the last request is NOT in a pending or accepted state', () => {
        beforeEach(() => {
          spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([MOCK_BUYER_REQUEST_EXPIRED]));
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
        });

        it('should show the buy banner', fakeAsync(() => {
          const expectedBanner: PriceableDeliveryBanner & ActionableDeliveryBanner = {
            type: DELIVERY_BANNER_TYPE.BUY,
            action: MOCK_BUY_DELIVERY_BANNER_PROPERTIES.action,
            price: MOCK_DELIVERY_ITEM_DETAILS.minimumPurchaseCost,
          };

          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
            expect(result).toEqual(expectedBanner);
          });
          tick();
        }));
      });
    });

    describe('when buyer has 0 requests to current item', () => {
      beforeEach(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([]));
      });

      describe('and server responses with buy cost price', () => {
        describe('when the item is not shippable', () => {
          beforeEach(() => {
            spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(
              of(MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE)
            );
          });

          it('should hide banner', fakeAsync(() => {
            service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
              expect(result).toBeFalsy();
            });
            tick();
          }));
        });

        describe('and when the item is shippable', () => {
          beforeEach(() => {
            spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
          });

          it('should show buy banner with price', fakeAsync(() => {
            const expectedBanner: PriceableDeliveryBanner & ActionableDeliveryBanner = {
              type: DELIVERY_BANNER_TYPE.BUY,
              action: MOCK_BUY_DELIVERY_BANNER_PROPERTIES.action,
              price: MOCK_DELIVERY_ITEM_DETAILS.minimumPurchaseCost,
            };

            service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
              expect(result).toEqual(expectedBanner);
            });
            tick();
          }));
        });
      });

      describe('and when the item is not shippable', () => {
        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(
            of(MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE)
          );
        });

        it('should hide banner', fakeAsync(() => {
          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
            expect(result).toBeFalsy();
          });
          tick();
        }));
      });

      describe('and when the seller did not activate shipping', () => {
        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(
            of(MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED)
          );
        });

        it('should show ask seller for shipping', fakeAsync(() => {
          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
            expect(result).toEqual(ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES);
          });
          tick();
        }));
      });
    });
  });

  describe('when handling banner CTA click', () => {
    describe('when the action is open the payview', () => {
      beforeEach(() => {
        spyOn(deliveryBannerTrackingEventsService, 'trackClickBannerBuy');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_AS_BUYER, DELIVERY_BANNER_ACTION.OPEN_PAYVIEW);
      });

      it('should navigate to the item payview', () => {
        const itemHash: string = MOCK_INBOX_CONVERSATION_AS_BUYER.item.id;
        const expectedRoute: string = `${PRIVATE_PATHS.CHAT}/${DELIVERY_PATHS.PAYVIEW}/${itemHash}`;

        expect(router.navigate).toHaveBeenCalledWith([expectedRoute]);
        expect(router.navigate).toHaveBeenCalledTimes(1);
      });

      it('should track the event', () => {
        expect(deliveryBannerTrackingEventsService.trackClickBannerBuy).toHaveBeenCalledTimes(1);
        expect(deliveryBannerTrackingEventsService.trackClickBannerBuy).toHaveBeenCalledWith({
          itemId: MOCK_INBOX_CONVERSATION_AS_BUYER.item.id,
          categoryId: MOCK_INBOX_CONVERSATION_AS_BUYER.item.categoryId,
          screenId: SCREEN_IDS.Chat,
          itemPrice: MOCK_INBOX_CONVERSATION_AS_BUYER.item.price.amount,
        });
      });
    });
  });

  describe('when handling third voices CTA click', () => {
    describe('and when there is last buyer request', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUESTS));
        spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));

        service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
        tick();
        tick();
      }));

      it('should redirect to TTS', () => {
        const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_BUYER_REQUESTS[0].id}`;

        service.handleThirdVoiceCTAClick();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('and when there is no last buyer request', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of([]));
        spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));

        service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
        tick();
        tick();
      }));

      it('should do nothing', () => {
        spyOn(modalService, 'open');

        service.handleThirdVoiceCTAClick();

        expect(modalService.open).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
