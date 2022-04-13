import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import {
  MOCK_BUYER_REQUESTS,
  MOCK_BUYER_REQUEST_ACCEPTED,
  MOCK_BUYER_REQUEST_EXPIRED,
  MOCK_BUYER_REQUEST_PAYMENT_READY,
  MOCK_BUYER_REQUEST_PENDING,
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
import { PATH_TO_PAYVIEW, PRIVATE_PATHS } from '@private/private-routing-constants';
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
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DeliveryPaymentReadyService } from '@private/shared/delivery-payment-ready/delivery-payment-ready.service';
import { PAYMENT_CONTINUED_POST_ACTION } from '@private/shared/delivery-payment-ready/enums/payment-continued-post-action.enum';

describe('DeliveryConversationContextAsBuyerService', () => {
  const featuresEnabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

  let service: DeliveryConversationContextAsBuyerService;
  let deliveryPaymentReadyService: DeliveryPaymentReadyService;
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
        { provide: BuyerRequestsApiService, useValue: { getLastRequestAsBuyerByItemHash: () => of(null) } },
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
        {
          provide: DeliveryPaymentReadyService,
          useValue: {
            continueBuyerRequestBuyFlow: () => of(null),
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsBuyerService);
    deliveryPaymentReadyService = TestBed.inject(DeliveryPaymentReadyService);
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
        spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUEST_EXPIRED));
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
      const testCases: BuyerRequest[][] = [[MOCK_BUYER_REQUEST_ACCEPTED], [MOCK_BUYER_REQUEST_PENDING], [MOCK_BUYER_REQUEST_PAYMENT_READY]];

      describe.each(testCases)('and when the last request is still valid', (testCase) => {
        beforeEach(() => {
          spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(testCase));
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

      describe('and when the last request is NOT pending, accepted or requires payment', () => {
        beforeEach(() => {
          spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUEST_EXPIRED));
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
        spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(null));
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
        const expectedRoute: string = `${PATH_TO_PAYVIEW}/${itemHash}`;

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
    beforeEach(() => {
      spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
      spyOn(deliveryPaymentReadyService, 'continueBuyerRequestBuyFlow').and.callThrough();
    });

    describe('and when there is last buyer request', () => {
      describe('and when last buyer request does NOT need to continue payment', () => {
        beforeEach(fakeAsync(() => {
          spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUEST_ACCEPTED));

          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
          tick();
          tick();
          service.handleThirdVoiceCTAClick();
        }));

        it('should redirect to TTS once', () => {
          expect(router.navigate).toHaveBeenCalledTimes(1);
        });

        it('should redirect to TTS URL', () => {
          const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_BUYER_REQUEST_ACCEPTED.id}`;

          expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
        });

        it('should NOT open continue payment flow', () => {
          expect(deliveryPaymentReadyService.continueBuyerRequestBuyFlow).not.toHaveBeenCalled();
        });
      });

      describe('and when last buyer request does need to continue payment flow', () => {
        beforeEach(fakeAsync(() => {
          spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUEST_PAYMENT_READY));

          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
          tick();
          tick();
          service.handleThirdVoiceCTAClick();
          tick();
        }));

        it('should ask to continue payment flow once', () => {
          expect(deliveryPaymentReadyService.continueBuyerRequestBuyFlow).toHaveBeenCalledTimes(1);
        });

        it('should ask to continue payment flow with last buyer request and redirect to TTS as fallback', () => {
          expect(deliveryPaymentReadyService.continueBuyerRequestBuyFlow).toHaveBeenCalledWith(
            MOCK_BUYER_REQUEST_PAYMENT_READY.id,
            MOCK_BUYER_REQUEST_PAYMENT_READY.itemHash,
            PAYMENT_CONTINUED_POST_ACTION.REDIRECT_TTS
          );
        });
      });
    });

    describe('and when there is no last buyer request', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsApiService, 'getLastRequestAsBuyerByItemHash').and.returnValue(of(null));

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
