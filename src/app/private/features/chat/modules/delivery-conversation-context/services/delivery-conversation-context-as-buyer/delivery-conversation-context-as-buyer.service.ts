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
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { InboxConversation } from '@private/features/chat/core/model';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';

@Injectable()
export class DeliveryConversationContextAsBuyerService {
  private lastRequest: BuyerRequest;

  constructor(
    private buyerRequestsApiService: BuyerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService,
    private router: Router,
    private modalService: NgbModal,
    private featureFlagService: FeatureFlagService
  ) {}

  public getBannerPropertiesAsBuyer(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item } = conversation;
    const { id: itemHash, sold } = item;

    return this.buyerRequestsApiService.getRequestsAsBuyerByItemHash(itemHash).pipe(
      tap((requests) => (this.lastRequest = requests ? requests[0] : null)),
      concatMap((buyerRequests: BuyerRequest[]) => {
        return this.deliveryItemDetailsApiService.getDeliveryDetailsByItemHash(itemHash).pipe(
          map((deliveryItemDetails: DeliveryItemDetails) => {
            return this.mapDeliveryDetailsAsBuyerToBannerProperties(buyerRequests, sold, deliveryItemDetails);
          })
        );
      })
    );
  }

  public handleThirdVoiceCTAClick(): void {
    this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((enabled) => {
      enabled ? this.redirectToTTS() : this.openAwarenessModal();
    });
  }

  public handleBannerCTAClick(conversation: InboxConversation, action: DELIVERY_BANNER_ACTION): void {
    if (action === DELIVERY_BANNER_ACTION.OPEN_PAYVIEW) {
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

  private redirectToTTS(): void {
    const isLastRequestPresent: boolean = !!this.lastRequest;
    if (isLastRequestPresent) {
      const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${this.lastRequest.id}`;
      this.router.navigate([route]);
    }
  }

  private mapDeliveryDetailsAsBuyerToBannerProperties(
    buyerRequests: BuyerRequest[],
    isItemSold: boolean,
    deliveryItemDetails?: DeliveryItemDetails
  ): DeliveryBanner {
    const noDeliveryItemDetails: boolean = !deliveryItemDetails;
    const buyerHasNoRequests: boolean = buyerRequests.length === 0;
    const buyerHasRequests: boolean = !buyerHasNoRequests;

    if (isItemSold) {
      return null;
    }

    if (noDeliveryItemDetails) {
      return ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES;
    }

    if (buyerHasRequests) {
      return null;
    }

    if (buyerHasNoRequests) {
      return BUY_DELIVERY_BANNER_PROPERTIES(deliveryItemDetails.minimumPurchaseCost);
    }

    return null;
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }
}
