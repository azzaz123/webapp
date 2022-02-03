import { Injectable } from '@angular/core';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { Money } from '@api/core/model/money.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import {
  BUYER_BUY_DELIVERY_BANNER_PROPERTIES,
  BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES,
} from '@private/features/chat/modules/delivery-banner/constants/delivery-banner-configs';
import { DELIVERY_BANNER_TYPE } from '../../../delivery-banner/enums/delivery-banner-type.enum';

@Injectable()
export class DeliveryConversationContextAsBuyerService {
  constructor(
    private buyerRequestsApiService: BuyerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService
  ) {}

  public getBannerPropertiesAsBuyer(itemHash: string): Observable<DeliveryBanner | null> {
    return this.buyerRequestsApiService.getRequestsAsBuyerByItemHash(itemHash).pipe(
      concatMap((buyerRequests: BuyerRequest[]) => {
        return this.deliveryItemDetailsApiService.getDeliveryDetailsByItemHash(itemHash).pipe(
          map((deliveryItemDetails: DeliveryItemDetails) => {
            return this.mapDeliveryItemDetailsAsBuyerToProperties(buyerRequests, deliveryItemDetails);
          })
        );
      })
    );
  }

  private mapDeliveryItemDetailsAsBuyerToProperties(
    buyerRequests: BuyerRequest[],
    deliveryItemDetails: DeliveryItemDetails
  ): DeliveryBanner | null {
    const bannerType: DELIVERY_BANNER_TYPE | null = this.mapDeliveryDetailsAsBuyerToBannerType(buyerRequests, deliveryItemDetails);
    const minimumPurchaseCost: Money | null = deliveryItemDetails ? deliveryItemDetails.minimumPurchaseCost : null;
    return this.mapBannerTypeToBuyerBannerProperties(bannerType, minimumPurchaseCost);
  }

  private mapDeliveryDetailsAsBuyerToBannerType(
    buyerRequests: BuyerRequest[],
    deliveryItemDetails?: DeliveryItemDetails
  ): DELIVERY_BANNER_TYPE {
    const noDeliveryItemDetails: boolean = !deliveryItemDetails;
    const buyerHasNoRequests: boolean = buyerRequests.length === 0;
    const buyerHasRequests: boolean = !buyerHasNoRequests;

    if (noDeliveryItemDetails) {
      return DELIVERY_BANNER_TYPE.HIDDEN;
    }

    if (buyerHasRequests) {
      return DELIVERY_BANNER_TYPE.HIDDEN;
    }

    if (buyerHasNoRequests) {
      return DELIVERY_BANNER_TYPE.BUY;
    }

    return DELIVERY_BANNER_TYPE.HIDDEN;
  }

  private mapBannerTypeToBuyerBannerProperties(type: DELIVERY_BANNER_TYPE, price?: Money): DeliveryBanner | null {
    if (type === DELIVERY_BANNER_TYPE.BUY) {
      return BUYER_BUY_DELIVERY_BANNER_PROPERTIES(price);
    }

    if (type === DELIVERY_BANNER_TYPE.ASK_SELLER_FOR_SHIPPING) {
      return BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES;
    }

    return null;
  }
}
