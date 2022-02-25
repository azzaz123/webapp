import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { concatMap, finalize, take } from 'rxjs/operators';
import { DeliveryBanner } from '@private/features/chat/modules/delivery-banner/interfaces/delivery-banner.interface';
import { DeliveryConversationContextAsBuyerService } from '../delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from '../delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';

@Injectable()
export class DeliveryConversationContextService {
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);
  private subscriptions: Subscription[] = [];

  constructor(
    private featureFlagService: FeatureFlagService,
    private deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService,
    private deliveryConversationContextAsSellerService: DeliveryConversationContextAsSellerService,
    private modalService: NgbModal
  ) {}

  public get bannerProperties$(): Observable<DeliveryBanner | null> {
    return this._bannerProperties$.asObservable();
  }

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private set loading(value: boolean) {
    this._loading$.next(value);
  }

  private set bannerProperties(newBannerProperties: DeliveryBanner) {
    this._bannerProperties$.next(newBannerProperties);
  }

  private get isDeliveryFlagEnabled(): Observable<boolean> {
    return this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).pipe(take(1));
  }

  public update(conversation: InboxConversation): void {
    this.loading = true;
    const subscription: Subscription = this.isDeliveryFlagEnabled
      .pipe(
        concatMap((enabled: boolean) => (enabled ? this.getBannerProperties(conversation) : of(null))),
        finalize(() => this.endLoading())
      )
      .subscribe(
        (banner: DeliveryBanner | null) => (this.bannerProperties = banner),
        () => this.endLoading(),
        () => this.endLoading()
      );
    this.subscriptions.push(subscription);
  }

  public reset(): void {
    this.bannerProperties = null;
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.endLoading();
  }

  public handleBannerCTAClick(conversation: InboxConversation, bannerActionType: DELIVERY_BANNER_ACTION): void {
    if (bannerActionType === DELIVERY_BANNER_ACTION.AWARENESS_MODAL) {
      return this.openAwarenessModal();
    }

    if (bannerActionType === DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING) {
      return this.deliveryConversationContextAsSellerService.handleBannerCTAClick(conversation, bannerActionType);
    }

    if (bannerActionType === DELIVERY_BANNER_ACTION.EDIT_ITEM_SALE_PRICE) {
      return this.deliveryConversationContextAsSellerService.handleBannerCTAClick(conversation, bannerActionType);
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
    const isCurrentUserTheSeller: boolean = this.isCurrentUserTheSeller(conversation);
    return isCurrentUserTheSeller
      ? this.deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller(conversation)
      : this.deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer(conversation);
  }

  private openAwarenessModal(): void {
    this.modalService.open(TRXAwarenessModalComponent);
  }

  private isCurrentUserTheSeller(conversation: InboxConversation): boolean {
    const { item } = conversation;
    const { isMine } = item;
    return isMine;
  }

  private endLoading(): void {
    this.loading = false;
  }
}
