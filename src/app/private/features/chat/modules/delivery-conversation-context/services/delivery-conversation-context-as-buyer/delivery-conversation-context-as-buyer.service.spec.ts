import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { MOCK_BUYER_REQUESTS } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { MOCK_DELIVERY_ITEM_DETAILS } from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { MOCK_INBOX_CONVERSATION_AS_BUYER, MOCK_INBOX_CONVERSATION_AS_BUYER_WITH_SOLD_ITEM } from '@fixtures/chat';
import { MOCK_BUY_DELIVERY_BANNER_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DELIVERY_BANNER_TYPE } from '../../../delivery-banner/enums/delivery-banner-type.enum';
import { ActionableDeliveryBanner } from '../../../delivery-banner/interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../delivery-banner/interfaces/priceable-delivery-banner.interface';

import { DeliveryConversationContextAsBuyerService } from './delivery-conversation-context-as-buyer.service';

describe('DeliveryConversationContextAsBuyerService', () => {
  let service: DeliveryConversationContextAsBuyerService;
  let buyerRequestsApiService: BuyerRequestsApiService;
  let deliveryItemDetailsApiService: DeliveryItemDetailsApiService;
  let featureFlagService: FeatureFlagService;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DeliveryConversationContextAsBuyerService,
        { provide: BuyerRequestsApiService, useValue: { getRequestsAsBuyerByItemHash: () => of(null) } },
        { provide: DeliveryItemDetailsApiService, useValue: { getDeliveryDetailsByItemHash: (_itemHash: string) => of(null) } },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
        { provide: NgbModal, useValue: { open: () => {} } },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsBuyerService);
    buyerRequestsApiService = TestBed.inject(BuyerRequestsApiService);
    deliveryItemDetailsApiService = TestBed.inject(DeliveryItemDetailsApiService);
    featureFlagService = TestBed.inject(FeatureFlagService);
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for buyer context', () => {
    describe('when buyer has done previously buy requests to current item', () => {
      beforeEach(() => {
        spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUESTS));
        spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
      });

      it('should hide banner', fakeAsync(() => {
        service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
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

        describe('and when the item was sold', () => {
          it('should hide banner', fakeAsync(() => {
            service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER_WITH_SOLD_ITEM).subscribe((result) => {
              expect(result).toBeFalsy();
            });
            tick();
          }));
        });

        describe('and when the item was not sold', () => {
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

      describe('and server responses without buy cost price', () => {
        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(null));
        });

        describe('and when the item was sold', () => {
          it('should hide banner', fakeAsync(() => {
            service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER_WITH_SOLD_ITEM).subscribe((result) => {
              expect(result).toBeFalsy();
            });
            tick();
          }));
        });

        describe('and when the item was not sold', () => {
          it('should show ask seller for shipping', fakeAsync(() => {
            service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe((result) => {
              expect(result).toEqual(ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES);
            });
            tick();
          }));
        });
      });
    });
  });

  describe('when handling banner CTA click', () => {
    describe('when the action is open the payview', () => {
      beforeEach(() => {
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_AS_BUYER, DELIVERY_BANNER_ACTION.OPEN_PAYVIEW);
      });

      it('should navigate to the item payview', () => {
        const itemHash: string = MOCK_INBOX_CONVERSATION_AS_BUYER.item.id;
        const expectedRoute: string = `${PRIVATE_PATHS.CHAT}/${DELIVERY_PATHS.PAYVIEW}/${itemHash}`;

        expect(router.navigate).toHaveBeenCalledWith([expectedRoute]);
        expect(router.navigate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when handling third voices CTA click', () => {
    describe('and when delivery feature flag is enabled', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'getLocalFlag').and.returnValue(of(true));
      });

      describe('and when there is last buyer request', () => {
        beforeEach(fakeAsync(() => {
          spyOn(buyerRequestsApiService, 'getRequestsAsBuyerByItemHash').and.returnValue(of(MOCK_BUYER_REQUESTS));
          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
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
          service.getBannerPropertiesAsBuyer(MOCK_INBOX_CONVERSATION_AS_BUYER).subscribe();
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

    describe('and when delivery feature flag is NOT enabled', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'getLocalFlag').and.returnValue(of(false));
        spyOn(modalService, 'open');
      });

      it('should open TRX awareness modal', () => {
        service.handleThirdVoiceCTAClick();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
      });
    });
  });
});
