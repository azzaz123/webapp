import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxConversation } from '@private/features/chat/core/model';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../../../delivery-banner/constants/delivery-banner-configs';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';
import { EditItemSalePriceModalComponent } from '../../../delivery-banner/components/banners/edit-price-banner/modals/edit-item-sale-price-modal/edit-item-sale-price-modal.component';
import { SELLER_REQUEST_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-request-status.enum';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { Router } from '@angular/router';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  private lastRequest: SellerRequest;

  constructor(private router: Router, private modalService: NgbModal, private sellerRequestsApiService: SellerRequestsApiService) {}

  public getBannerPropertiesAsSeller(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item, user: buyer } = conversation;
    const { id: itemHash, sold: isItemSold } = item;
    const { id: buyerHash } = buyer;

    return this.sellerRequestsApiService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(
      tap((sellerRequests) => (this.lastRequest = sellerRequests[0])),
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
    const isLastRequestPresent: boolean = !!this.lastRequest;
    if (isLastRequestPresent) {
      const navigateToAcceptScreen: boolean = this.lastRequest.status.request === SELLER_REQUEST_STATUS.PENDING;
      const lastRequestId: string = this.lastRequest.id;

      navigateToAcceptScreen ? this.navigateToAcceptScreen(lastRequestId) : this.navigateToTTS(lastRequestId);
    }
  }

  private navigateToTTS(requestId: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${requestId}`;
    this.router.navigate([route]);
  }

  private navigateToAcceptScreen(requestId: string): void {
    const route: string = `${PRIVATE_PATHS.ACCEPT_SCREEN}/${this.lastRequest.id}`;
    this.router.navigate([route]);
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
