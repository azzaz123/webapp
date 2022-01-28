import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { InboxConversation } from '../../core/model';
import { DeliveryBanner } from '../delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryConversationContextAsBuyerService } from './services/delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';

@Injectable()
export class DeliveryConversationContextService {
  constructor(
    private featureFlagService: FeatureFlagService,
    private deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService
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
      ? this.getBannerPropertiesAsSeller(itemHash)
      : this.deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer(itemHash);
  }

  // TODO
  private getBannerPropertiesAsSeller(itemHash: string): Observable<DeliveryBanner | null> {
    return of(null);
  }
}
