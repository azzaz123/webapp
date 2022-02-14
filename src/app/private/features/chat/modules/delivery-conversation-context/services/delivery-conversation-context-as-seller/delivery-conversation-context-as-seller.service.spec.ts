import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { MOCK_INBOX_CONVERSATION_AS_SELLER, MOCK_INBOX_CONVERSATION_AS_SELLER_WITH_SOLD_ITEM } from '@fixtures/chat';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { of } from 'rxjs';
import { EditItemSalePriceModalComponent } from '../../../delivery-banner/components/banners/edit-price-banner/modals/edit-item-sale-price-modal/edit-item-sale-price-modal.component';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../delivery-banner/interfaces/actionable-delivery-banner.interface';

import { DeliveryConversationContextAsSellerService } from './delivery-conversation-context-as-seller.service';

describe('DeliveryConversationContextAsSellerService', () => {
  let service: DeliveryConversationContextAsSellerService;
  let modalService: NgbModal;
  let sellerRequestsApiService: SellerRequestsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryConversationContextAsSellerService,
        { provide: NgbModal, useValue: { open: () => {} } },
        { provide: SellerRequestsApiService, useValue: { getRequestsByBuyerAndItem: () => {} } },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextAsSellerService);
    modalService = TestBed.inject(NgbModal);
    sellerRequestsApiService = TestBed.inject(SellerRequestsApiService);
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

      it('should show edit price banner', fakeAsync(() => {
        const expectedBanner: ActionableDeliveryBanner = SELLER_EDIT_PRICE_BANNER_PROPERTIES;

        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER).subscribe((result) => {
          expect(result).toEqual(expectedBanner);
        });
        tick();
      }));
    });

    describe('when the item is already sold', () => {
      beforeEach(() => {
        spyOn(sellerRequestsApiService, 'getRequestsByBuyerAndItem').and.returnValue(of([]));
      });

      it('should hide banner', fakeAsync(() => {
        service.getBannerPropertiesAsSeller(MOCK_INBOX_CONVERSATION_AS_SELLER_WITH_SOLD_ITEM).subscribe((result) => {
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

  describe('when handling CTA button', () => {
    beforeEach(() => {
      spyOn(modalService, 'open');
      service.handleThirdVoiceCTAClick();
    });

    it('should open TRX awareness modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });
  });
});
