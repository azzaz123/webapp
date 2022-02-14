import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxConversation } from '@private/features/chat/core/model';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';
import { EditItemSalePriceModalComponent } from '../../../delivery-banner/components/banners/edit-price-banner/modals/edit-item-sale-price-modal/edit-item-sale-price-modal.component';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  constructor(private modalService: NgbModal, private sellerRequestsApiService: SellerRequestsApiService) {}

  public getBannerPropertiesAsSeller(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item, user: buyer } = conversation;
    const { id: itemHash, sold: isItemSold } = item;
    const { id: buyerHash } = buyer;

    return this.sellerRequestsApiService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(
      map((response: SellerRequest[]) => {
        return this.mapSellerRequestsToBannerProperties(response, isItemSold);
      })
    );
  }

  public handleBannerCTAClick(conversation: InboxConversation, action: DELIVERY_BANNER_ACTION): void {
    if (action === DELIVERY_BANNER_ACTION.EDIT_ITEM_SALE_PRICE) {
      const { item } = conversation;
      const modalRef = this.modalService.open(EditItemSalePriceModalComponent, { windowClass: 'modal-small' }).componentInstance;
      modalRef.item = item;
      return;
    }

    return this.openAwarenessModal();
  }

  public handleThirdVoiceCTAClick(): void {
    this.openAwarenessModal();
  }

  private mapSellerRequestsToBannerProperties(sellerRequests: SellerRequest[], isItemSold: boolean): DeliveryBanner | null {
    const sellerHasNoRequests: boolean = sellerRequests.length === 0;
    const sellerHasRequests: boolean = !sellerHasNoRequests;

    if (isItemSold) {
      return null;
    }

    if (sellerHasRequests) {
      return null;
    }

    if (sellerHasNoRequests) {
      return SELLER_EDIT_PRICE_BANNER_PROPERTIES;
    }

    return null;
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }
}
