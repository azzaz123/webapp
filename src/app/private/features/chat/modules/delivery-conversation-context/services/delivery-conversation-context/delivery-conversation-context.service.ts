import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryConversationContextAsBuyerService } from '../delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from '../delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';

@Injectable()
export class DeliveryConversationContextService {
  constructor(
    private featureFlagService: FeatureFlagService,
    private deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService,
    private deliveryConversationContextAsSellerService: DeliveryConversationContextAsSellerService,
    private modalService: NgbModal
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

  public handleBannerCTAClick(conversation: InboxConversation, bannerActionType: DELIVERY_BANNER_ACTION): void {
    if (bannerActionType === DELIVERY_BANNER_ACTION.AWARENESS_MODAL) {
      return this.openAwarenessModal();
    }

    if (bannerActionType === DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING) {
      return this.openAwarenessModal();
    }

    if (bannerActionType === DELIVERY_BANNER_ACTION.CHANGE_ITEM_PRICE) {
      return this.openAwarenessModal();
    }

    if (bannerActionType === DELIVERY_BANNER_ACTION.OPEN_PAYVIEW) {
      return this.openAwarenessModal();
    }

    return this.openAwarenessModal();
  }

  public handleThirdVoiceCTAClick(conversation: InboxConversation): void {
    const isCurrentUserTheSeller: boolean = this.isCurrentUserTheSeller(conversation);

    isCurrentUserTheSeller
      ? this.deliveryConversationContextAsSellerService.handleThirdVoiceCTAClick()
      : this.deliveryConversationContextAsBuyerService.handleThirdVoiceCTAClick();
  }

  private getBannerProperties(conversation: InboxConversation): Observable<DeliveryBanner | null> {
    const { item } = conversation;
    const { id: itemHash } = item;
    const isCurrentUserTheSeller: boolean = this.isCurrentUserTheSeller(conversation);
    return isCurrentUserTheSeller
      ? this.deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller(itemHash)
      : this.deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer(itemHash);
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }

  private isCurrentUserTheSeller(conversation: InboxConversation): boolean {
    const { item } = conversation;
    const { isMine } = item;
    return isMine;
  }
}
