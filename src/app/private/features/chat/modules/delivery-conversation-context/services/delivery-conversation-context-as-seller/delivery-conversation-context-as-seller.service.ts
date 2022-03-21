import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SellerRequestsApiService } from '@api/delivery/seller/requests/seller-requests-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxConversation } from '@private/features/chat/core/model';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { Observable } from 'rxjs';
import {
  ACTIVATE_SHIPPING_BANNER_PROPERTIES,
  EDIT_PRICE_BANNER_PROPERTIES,
} from '../../../delivery-banner/constants/delivery-banner-configs';
import { concatMap, map, tap } from 'rxjs/operators';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../../../delivery-banner/interfaces/delivery-banner.interface';
import { EditItemSalePriceModalComponent } from '../../../delivery-banner/components/banners/edit-price-banner/modals/edit-item-sale-price-modal/edit-item-sale-price-modal.component';
import { SELLER_REQUEST_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-request-status.enum';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { Router } from '@angular/router';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { UPLOAD_PATHS } from '@private/features/upload/upload-routing-constants';
import { CATALOG_PATHS } from '@private/features/catalog/catalog-routing-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { ChatTrackingEventsService } from '@private/features/chat/services/chat-tracking-events/chat-tracking-events.service';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';

@Injectable()
export class DeliveryConversationContextAsSellerService {
  private lastRequest: SellerRequest;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private featureFlagService: FeatureFlagService,
    private sellerRequestsApiService: SellerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService,
    private chatTrackingEventsService: ChatTrackingEventsService
  ) {}

  public getBannerPropertiesAsSeller(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item, user: buyer } = conversation;
    const { id: itemHash } = item;
    const { id: buyerHash } = buyer;

    return this.sellerRequestsApiService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(
      tap((sellerRequests) => (this.lastRequest = sellerRequests[0])),
      concatMap((sellerRequests: SellerRequest[]) => {
        return this.deliveryItemDetailsApiService.getDeliveryDetailsByItemHash(itemHash).pipe(
          map((deliveryItemDetails: DeliveryItemDetails) => {
            return this.mapSellerRequestsToBannerProperties(sellerRequests, deliveryItemDetails);
          })
        );
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

    if (action === DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING) {
      this.chatTrackingEventsService.trackClickActivateShipping({
        itemId: conversation.item.id,
        categoryId: conversation.item.categoryId,
        screenId: SCREEN_IDS.Chat,
        itemPrice: conversation.item.price.amount,
      });
      return this.navigateToEditItemShippingToggle(conversation);
    }

    return this.openAwarenessModal();
  }

  public handleThirdVoiceCTAClick(): void {
    const isLastRequestPresent: boolean = !!this.lastRequest;
    if (isLastRequestPresent) {
      const navigateToAcceptScreen: boolean = this.lastRequest.status.request === SELLER_REQUEST_STATUS.PENDING;
      const { id } = this.lastRequest;
      navigateToAcceptScreen ? this.navigateToAcceptScreen(id) : this.navigateToTTS(id);
    }
  }

  private navigateToTTS(requestId: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${requestId}`;
    this.router.navigate([route]);
  }

  private navigateToAcceptScreen(requestId: string): void {
    this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((enabled) => {
      const isDisabled: boolean = !enabled;
      if (isDisabled) {
        return this.openAwarenessModal();
      }
      const route: string = `${PRIVATE_PATHS.ACCEPT_SCREEN}/${requestId}`;
      this.router.navigate([route]);
    });
  }

  private navigateToEditItemShippingToggle(conversation: InboxConversation): void {
    const { item } = conversation;
    const { id: itemHash } = item;
    const route: string = `${PRIVATE_PATHS.CATALOG}/${CATALOG_PATHS.EDIT}/${itemHash}/${UPLOAD_PATHS.ACTIVATE_SHIPPING}`;
    this.router.navigate([route]);
  }

  private mapSellerRequestsToBannerProperties(
    sellerRequests: SellerRequest[],
    deliveryItemDetails: DeliveryItemDetails
  ): DeliveryBanner | null {
    const sellerHasNoRequests: boolean = sellerRequests.length === 0;
    const sellerHasRequests: boolean = !sellerHasNoRequests;
    const isShippingNotAllowed: boolean = !deliveryItemDetails.isShippingAllowed;
    const isNotShippable: boolean = !deliveryItemDetails.isShippable;

    if (isNotShippable || sellerHasRequests) {
      return null;
    }

    if (isShippingNotAllowed) {
      return ACTIVATE_SHIPPING_BANNER_PROPERTIES;
    }

    if (sellerHasNoRequests) {
      return EDIT_PRICE_BANNER_PROPERTIES;
    }

    return null;
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }
}
