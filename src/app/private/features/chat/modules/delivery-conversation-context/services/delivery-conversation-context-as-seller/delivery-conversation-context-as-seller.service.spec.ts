import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import {
  MOCK_DELIVERY_ITEM_DETAILS,
  MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE,
  MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED,
} from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';
import { MOCK_INBOX_CONVERSATION_AS_SELLER } from '@fixtures/chat';
import { MOCK_PENDING_SELLER_REQUEST, MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CATALOG_PATHS } from '@private/features/catalog/catalog-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { UPLOAD_PATHS } from '@private/features/upload/upload-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';
import { EditItemSalePriceModalComponent } from '../../../delivery-banner/components/banners/edit-price-banner/modals/edit-item-sale-price-modal/edit-item-sale-price-modal.component';
import {
  ACTIVATE_SHIPPING_BANNER_PROPERTIES,
  EDIT_PRICE_BANNER_PROPERTIES,
} from '../../../delivery-banner/constants/delivery-banner-configs';
import { DeliveryBannerTrackingEventsService } from '../../../delivery-banner/services/delivery-banner-tracking-events/delivery-banner-tracking-events.service';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../delivery-banner/interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';

import { DeliveryConversationContextAsSellerService } from './delivery-conversation-context-as-seller.service';

describe('DeliveryConversationContextAsSellerService', () => {
  let service: DeliveryConversationContextAsSellerService;
  let router: Router;
  let modalService: NgbModal;
  let sellerRequestsApiService: SellerRequestsApiService;
  let deliveryItemDetailsApiService: DeliveryItemDetailsApiService;
  let deliveryBannerTrackingEventsService: DeliveryBannerTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DeliveryConversationContextAsSellerService,
        { provide: NgbModal, useValue: { open: () => {} } },
        { provide: SellerRequestsApiService, useValue: { getRequestsByBuyerAndItem: () => of({}) } },
        { provide: DeliveryItemDetailsApiService, useValue: { getDeliveryDetailsByItemHash: () => of({}) } },
        {
          provide: DeliveryBannerTrackingEventsService,
          useValue: {
            trackClickEditItemPrice() {},
            trackClickActivateShipping() {},
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsSellerService);
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    sellerRequestsApiService = TestBed.inject(SellerRequestsApiService);
    deliveryItemDetailsApiService = TestBed.inject(DeliveryItemDetailsApiService);
    deliveryBannerTrackingEventsService = TestBed.inject(DeliveryBannerTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for seller context', () => {
    describe('when seller has received previously buy requests for current item', () => {
      beforeEach(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(of([MOCK_SELLER_REQUEST]));
      });

      it('should hide banner', fakeAsync(() => {
        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe((result) => {
          expect(result).toBeFalsy();
        });
        tick();
      }));
    });

    describe('when seller has received no buy requests from buyer for current item', () => {
      beforeEach(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(of([]));
      });

      describe('and when seller activated the shipping toggle for item', () => {
        const expectedBanner: ActionableDeliveryBanner = EDIT_PRICE_BANNER_PROPERTIES;
        let result: DeliveryBanner;

        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS));
          service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe((properties: DeliveryBanner) => {
            result = properties;
          });
        });

        it('should show edit price banner', fakeAsync(() => {
          expect(result).toEqual(expectedBanner);
          tick();
        }));
      });

      describe('and when seller has NOT activated the shipping toggle for item', () => {
        beforeEach(() => {
          spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(
            of(MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED)
          );
        });

        it('should show activate shipping banner', fakeAsync(() => {
          const expectedBanner: ActionableDeliveryBanner = ACTIVATE_SHIPPING_BANNER_PROPERTIES;

          service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe((result) => {
            expect(result).toEqual(expectedBanner);
          });
          tick();
        }));
      });
    });

    describe('when the item is not shippable', () => {
      beforeEach(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(of([]));
        spyOn(deliveryItemDetailsApiService, 'getDeliveryDetailsByItemHash').and.returnValue(of(MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE));
      });

      it('should hide banner', fakeAsync(() => {
        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe((result) => {
          expect(result).toBeFalsy();
        });
        tick();
      }));
    });
  });

  describe('when handling banner CTA clicked', () => {
    describe('when the action is to edit the item price', () => {
      let mockEditPriceModalInstance: Partial<EditItemSalePriceModalComponent> = { item: null };

      beforeEach(() => {
        spyOn(deliveryBannerTrackingEventsService, 'trackClickEditItemPrice');
        spyOn(modalService, 'open').and.returnValue({ componentInstance: mockEditPriceModalInstance });
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_AS_SELLER, DELIVERY_BANNER_ACTION.EDIT_ITEM_SALE_PRICE);
      });

      it('should open the edit item sale price modal', () => {
        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(EditItemSalePriceModalComponent, { windowClass: 'modal-small' });
      });

      it('should pass data to modal', () => {
        expect(mockEditPriceModalInstance.item).toEqual(MOCK_INBOX_CONVERSATION_AS_SELLER.item);
      });

      it('should track the event ', () => {
        expect(deliveryBannerTrackingEventsService.trackClickEditItemPrice).toHaveBeenCalledTimes(1);
        expect(deliveryBannerTrackingEventsService.trackClickEditItemPrice).toHaveBeenCalledWith({
          itemId: MOCK_INBOX_CONVERSATION_AS_SELLER.item.id,
          categoryId: MOCK_INBOX_CONVERSATION_AS_SELLER.item.categoryId,
          itemPrice: MOCK_INBOX_CONVERSATION_AS_SELLER.item.price.amount,
          screenId: SCREEN_IDS.Chat,
        });
      });
    });

    describe('when the action is to activate shipping for item', () => {
      beforeEach(() => {
        spyOn(deliveryBannerTrackingEventsService, 'trackClickActivateShipping');
        spyOn(router, 'navigate');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_AS_SELLER, DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING);
      });

      it('should navigate to edit item', () => {
        const expectedUrl: string = `${PRIVATE_PATHS.CATALOG}/${CATALOG_PATHS.EDIT}/${MOCK_INBOX_CONVERSATION_AS_SELLER.item.id}/${UPLOAD_PATHS.ACTIVATE_SHIPPING}`;

        service.handleThirdVoiceCTAClick();

        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });

      it('should track the event ', () => {
        expect(deliveryBannerTrackingEventsService.trackClickActivateShipping).toHaveBeenCalledTimes(1);
        expect(deliveryBannerTrackingEventsService.trackClickActivateShipping).toHaveBeenCalledWith({
          itemId: MOCK_INBOX_CONVERSATION_AS_SELLER.item.id,
          categoryId: MOCK_INBOX_CONVERSATION_AS_SELLER.item.categoryId,
          screenId: SCREEN_IDS.Chat,
          itemPrice: MOCK_INBOX_CONVERSATION_AS_SELLER.item.price.amount,
        });
      });
    });

    describe('when the action is not managed', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_AS_SELLER, DELIVERY_BANNER_ACTION.OPEN_PAYVIEW);
      });

      it('should open TRX awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
      });
    });
  });

  describe('when handling third voices CTA button', () => {
    describe('and when conversation has a pending request as the last request', () => {
      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(of([MOCK_PENDING_SELLER_REQUEST]));
        spyOn(router, 'navigate');
        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe();
        service.handleThirdVoiceCTAClick();
        tick();
      }));

      it('should open the accept screen', () => {
        const expectedUrl: string = `${PRIVATE_PATHS.ACCEPT_SCREEN}/${MOCK_SELLER_REQUEST.id}`;

        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('and when conversation has a non pending request as the last request', () => {
      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(
          of([MOCK_SELLER_REQUEST, MOCK_PENDING_SELLER_REQUEST])
        );
        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe();
        tick();
      }));

      it('should open the TTS', () => {
        const expectedUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_SELLER_REQUEST.id}`;
        spyOn(router, 'navigate');

        service.handleThirdVoiceCTAClick();

        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('and when last request did not load', () => {
      it('should do nothing', () => {
        spyOn(router, 'navigate');

        service.handleThirdVoiceCTAClick();

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
