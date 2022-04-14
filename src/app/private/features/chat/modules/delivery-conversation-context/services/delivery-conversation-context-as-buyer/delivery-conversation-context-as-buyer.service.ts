import { Injectable } from '@angular/core';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, finalize, map, tap } from 'rxjs/operators';
import {
  ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES,
  BUY_DELIVERY_BANNER_PROPERTIES,
} from '@private/features/chat/modules/delivery-banner/constants/delivery-banner-configs';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PATH_TO_PAYVIEW, PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { InboxConversation, InboxItem } from '@private/features/chat/core/model';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';
import { DeliveryBannerTrackingEventsService } from '../../../delivery-banner/services/delivery-banner-tracking-events/delivery-banner-tracking-events.service';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { ContinueDeliveryPaymentService } from '@private/shared/continue-delivery-payment/continue-delivery-payment';
import { PAYMENT_CONTINUED_POST_ACTION } from '@private/shared/continue-delivery-payment/enums/payment-continued-post-action.enum';

@Injectable()
export class DeliveryConversationContextAsBuyerService {
  private lastRequest: BuyerRequest;

  constructor(
    private buyerRequestsApiService: BuyerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService,
    private router: Router,
    private modalService: NgbModal,
    private deliveryBannerTrackingEventsService: DeliveryBannerTrackingEventsService,
    private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService,
    private continueDeliveryPaymentService: ContinueDeliveryPaymentService
  ) {}

  public getBannerPropertiesAsBuyer(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item } = conversation;
    const { id: itemHash } = item;

    return this.buyerRequestsApiService.getLastRequestAsBuyerByItemHash(itemHash).pipe(
      tap((request) => (this.lastRequest = request)),
      concatMap((buyerRequest: BuyerRequest) => {
        return combineLatest([
          this.deliveryItemDetailsApiService.getDeliveryDetailsByItemHash(itemHash),
          this.deliveryExperimentalFeaturesService.featuresEnabled$,
        ]).pipe(
          map(([deliveryItemDetails, featuresEnabled]) => {
            return this.mapDeliveryDetailsAsBuyerToBannerProperties(buyerRequest, deliveryItemDetails, featuresEnabled);
          })
        );
      })
    );
  }

  public handleThirdVoiceCTAClick(): void {
    const noLastRequest: boolean = !this.lastRequest;
    if (noLastRequest) {
      return;
    }

    this.requestNeedsPayment() ? this.openContinuePaymentFlow() : this.redirectToTTS(this.lastRequest.id);
  }

  public handleBannerCTAClick(conversation: InboxConversation, action: DELIVERY_BANNER_ACTION): void {
    if (action === DELIVERY_BANNER_ACTION.OPEN_PAYVIEW) {
      this.trackClickBannerBuy(conversation.item);
      return this.redirectToPayview(conversation);
    }

    return this.openAwarenessModal();
  }

  private openContinuePaymentFlow(): void {
    this.continueDeliveryPaymentService
      .continue(this.lastRequest.id, this.lastRequest.itemHash, PAYMENT_CONTINUED_POST_ACTION.REDIRECT_TTS)
      .subscribe();
  }

  private redirectToPayview(conversation: InboxConversation): void {
    const { item } = conversation;
    const { id: itemHash } = item;
    const route: string = `${PATH_TO_PAYVIEW}/${itemHash}`;
    this.router.navigate([route]);
  }

  private redirectToTTS(id: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${id}`;
    this.router.navigate([route]);
  }

  private mapDeliveryDetailsAsBuyerToBannerProperties(
    lastBuyerRequest: BuyerRequest,
    deliveryItemDetails: DeliveryItemDetails,
    isDeliveryFeaturesEnabled: boolean
  ): DeliveryBanner {
    const isShippingNotAllowed: boolean = !deliveryItemDetails.isShippingAllowed;
    const isNotShippable: boolean = !deliveryItemDetails.isShippable;
    const buyerHasNoLastRequest: boolean = !lastBuyerRequest;

    // TODO: Remove "isDeliveryFeaturesEnabled" when opening buyer banners
    // Doing this logic in the mapping to allow third voices to have delivery context of this service
    // Jira reference: https://wallapop.atlassian.net/browse/WPA-11990

    // TODO: Review/remove this condition when TRX MVP is done
    // Apps hide the buy banner for this case and user has to go to item detail to open payview
    // In web, while we don't have the payview entry point in the item detail,
    // we will show the buy banner when last request is not accepted or it is not pending
    const lastRequestFailed: boolean = !(
      lastBuyerRequest?.status.request === BUYER_REQUEST_STATUS.ACCEPTED ||
      lastBuyerRequest?.status.request === BUYER_REQUEST_STATUS.PENDING ||
      lastBuyerRequest?.status.request === BUYER_REQUEST_STATUS.PAYMENT_REQUIRED
    );
    const showBuyBanner: boolean = buyerHasNoLastRequest || lastRequestFailed;

    if (!isDeliveryFeaturesEnabled || isNotShippable) {
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

  private requestNeedsPayment(): boolean {
    if (!this.lastRequest) {
      return false;
    }

    return this.lastRequest.status.payment === BUYER_REQUEST_PAYMENT_STATUS.READY;
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
