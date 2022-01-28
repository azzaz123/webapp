import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryConversationContextAsBuyerService } from '../delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from '../delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';

@Injectable()
export class DeliveryConversationContextService {
  constructor(
    private featureFlagService: FeatureFlagService,
    private deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService,
    private deliveryConversationContextAsSellerService: DeliveryConversationContextAsSellerService
  ) {}

  private _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);
  private subscriptions: Subscription[] = [];

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
    const subscription: Subscription = this.isDeliveryFlagEnabled
      .pipe(concatMap((enabled: boolean) => (enabled ? this.getBannerProperties(conversation) : of(null))))
      .subscribe((banner: DeliveryBanner | null) => (this.bannerProperties = banner));
    this.subscriptions.push(subscription);
  }

  public reset(): void {
    this.bannerProperties = null;
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private getBannerProperties(conversation: InboxConversation): Observable<DeliveryBanner> {
    const { item } = conversation;
    const { id: itemHash, isMine } = item;
    return isMine
      ? this.deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller(itemHash)
      : this.deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer(itemHash);
  }
}
