import { Injectable } from '@angular/core';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { Observable } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import {
  ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES,
  BUY_DELIVERY_BANNER_PROPERTIES,
} from '@private/features/chat/modules/delivery-banner/constants/delivery-banner-configs';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { InboxConversation, InboxItem } from '@private/features/chat/core/model';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';
import { DeliveryBannerTrackingEventsService } from '../../../delivery-banner/services/delivery-banner-tracking-events/delivery-banner-tracking-events.service';

@Injectable()
export class DeliveryConversationContextAsBuyerService {
  private lastRequest: BuyerRequest;

  constructor(
    private buyerRequestsApiService: BuyerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService,
    private router: Router,
    private modalService: NgbModal,
    private deliveryBannerTrackingEventsService: DeliveryBannerTrackingEventsService
  ) {}

  public getBannerPropertiesAsBuyer(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item } = conversation;
    const { id: itemHash } = item;

    return this.buyerRequestsApiService.getRequestsAsBuyerByItemHash(itemHash).pipe(
      tap((requests) => (this.lastRequest = requests ? requests[0] : null)),
      concatMap((buyerRequests: BuyerRequest[]) => {
        return this.deliveryItemDetailsApiService.getDeliveryDetailsByItemHash(itemHash).pipe(
          map((deliveryItemDetails: DeliveryItemDetails) => {
            return this.mapDeliveryDetailsAsBuyerToBannerProperties(buyerRequests, deliveryItemDetails);
          })
        );
      })
    );
  }

  public handleThirdVoiceCTAClick(): void {
    const isLastRequestPresent: boolean = !!this.lastRequest;
    if (isLastRequestPresent) {
      const { id } = this.lastRequest;
      this.redirectToTTS(id);
    }
  }

  public handleBannerCTAClick(conversation: InboxConversation, action: DELIVERY_BANNER_ACTION): void {
    if (action === DELIVERY_BANNER_ACTION.OPEN_PAYVIEW) {
      this.trackClickBannerBuy(conversation.item);
      return this.redirectToPayview(conversation);
    }

    return this.openAwarenessModal();
  }

  private redirectToPayview(conversation: InboxConversation): void {
    const { item } = conversation;
    const { id: itemHash } = item;
    const route: string = `${PRIVATE_PATHS.CHAT}/${DELIVERY_PATHS.PAYVIEW}/${itemHash}`;
    this.router.navigate([route]);
  }

  private redirectToTTS(id: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${id}`;
    this.router.navigate([route]);
  }

  private mapDeliveryDetailsAsBuyerToBannerProperties(
    buyerRequests: BuyerRequest[],
    deliveryItemDetails: DeliveryItemDetails
  ): DeliveryBanner {
    const isShippingNotAllowed: boolean = !deliveryItemDetails.isShippingAllowed;
    const isNotShippable: boolean = !deliveryItemDetails.isShippable;
    const buyerHasNoRequests: boolean = buyerRequests.length === 0;

    // TODO: Review/remove this condition when TRX MVP is done
    // Apps hide the buy banner for this case and user has to go to item detail to open payview
    // In web, while we don't have the payview entry point in the item detail,
    // we will show the buy banner when last request is not accepted or it is not pending
    const lastRequestFailed: boolean = !(
      this.lastRequest?.status === BUYER_REQUEST_STATUS.ACCEPTED || this.lastRequest?.status === BUYER_REQUEST_STATUS.PENDING
    );
    const showBuyBanner: boolean = buyerHasNoRequests || lastRequestFailed;

    if (isNotShippable) {
      return null;
    }

    if (isShippingNotAllowed) {
      return ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES;
    }

    if (showBuyBanner) {
      return BUY_DELIVERY_BANNER_PROPERTIES(deliveryItemDetails.minimumPurchaseCost);
    }

    return null;
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }

  private trackClickBannerBuy(item: InboxItem): void {
    this.deliveryBannerTrackingEventsService.trackClickBannerBuy({
      itemId: item.id,
      categoryId: item.categoryId,
      screenId: SCREEN_IDS.Chat,
      itemPrice: item.price.amount,
    });
  }
}
