import { Injectable } from '@angular/core';
import { DeliveryItemDetailsApiService } from '@api/bff/delivery/items/detail/delivery-item-details-api.service';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { Money } from '@api/core/model/money.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { InboxConversation } from '../../core/model';
import { DELIVERY_BANNER_TYPE } from '../../modules/delivery-banner/enums/delivery-banner-type.enum';
import { DeliveryBanner } from '../../modules/delivery-banner/interfaces/delivery-banner.interface';
import {
  BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES,
  BUYER_BUY_DELIVERY_BANNER_PROPERTIES,
  SELLER_ACTIVATE_SHIPPING_BANNER_PROPERTIES,
  SELLER_EDIT_PRICE_BANNER_PROPERTIES,
} from './constants/delivery-banner-configs';

@Injectable()
export class DeliveryConversationContextService {
  constructor(
    private featureFlagService: FeatureFlagService,
    private buyerRequestsServices: BuyerRequestsApiService,
    private deliveryItemDetailsApiService: DeliveryItemDetailsApiService
  ) {}

  private _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);

  public get bannerProperties$(): Observable<DeliveryBanner | null> {
    return this._bannerProperties$.asObservable();
  }

  private set bannerProperties(newBannerProperties: DeliveryBanner) {
    this._bannerProperties$.next(newBannerProperties);
  }

  private get isDeliveryFlagEnabled(): Observable<boolean> {
    return this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).pipe(take(1));
  }

  public update(conversation: InboxConversation): void {
    this.isDeliveryFlagEnabled
      .pipe(concatMap((enabled: boolean) => (enabled ? this.getBannerProperties(conversation) : of(null))))
      .subscribe((banner: DeliveryBanner | null) => (this.bannerProperties = banner));
  }

  private getBannerProperties(conversation: InboxConversation): Observable<DeliveryBanner> {
    const { item } = conversation;
    const { id: itemHash, isMine } = item;
    return isMine ? this.getBannerPropertiesAsSeller(itemHash) : this.getBannerPropertiesAsBuyer(itemHash);
  }

  private getBannerPropertiesAsBuyer(itemHash: string): Observable<DeliveryBanner | null> {
    return this.buyerRequestsServices.getRequestsAsBuyerByItemHash(itemHash).pipe(
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
    const bannerType: DELIVERY_BANNER_TYPE = this.mapDeliveryDetailsAsBuyerToBannerType(buyerRequests, deliveryItemDetails);
    const minimumPurchaseCost: Money | null = deliveryItemDetails ? deliveryItemDetails.minimumPurchaseCost : null;
    return this.mapBannerTypeToProperties(bannerType, minimumPurchaseCost);
  }

  // TODO
  private getBannerPropertiesAsSeller(itemHash: string): Observable<DeliveryBanner | null> {
    return of(null);
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
      return DELIVERY_BANNER_TYPE.BUYER_BUY;
    }

    return DELIVERY_BANNER_TYPE.HIDDEN;
  }

  private mapBannerTypeToProperties(type: DELIVERY_BANNER_TYPE, price?: Money): DeliveryBanner | null {
    if (type === DELIVERY_BANNER_TYPE.HIDDEN) {
      return null;
    }

    if (type === DELIVERY_BANNER_TYPE.BUYER_BUY) {
      return BUYER_BUY_DELIVERY_BANNER_PROPERTIES(price);
    }

    if (type === DELIVERY_BANNER_TYPE.BUYER_ASK_SELLER_FOR_SHIPPING) {
      return BUYER_ASK_SELLER_FOR_SHIPPING_BANNER_PROPERTIES;
    }

    if (type === DELIVERY_BANNER_TYPE.SELLER_ACTIVATE_SHIPPING) {
      return SELLER_ACTIVATE_SHIPPING_BANNER_PROPERTIES;
    }

    if (type === DELIVERY_BANNER_TYPE.SELLER_EDIT_PRICE) {
      return SELLER_EDIT_PRICE_BANNER_PROPERTIES;
    }

    return null;
  }
}
