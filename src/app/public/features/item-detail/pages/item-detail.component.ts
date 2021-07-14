import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { ItemCard, ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { RecommenderItemCardFavouriteCheckedService } from '@public/features/item-detail/core/services/recommender-item-card-favourite-checked/recommender-item-card-favourite-checked.service';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { CarouselSlide } from '@shared/components/carousel-slides/carousel-slide.interface';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag-constants';
import { SOCIAL_SHARE_CHANNELS } from '@shared/social-share/enums/social-share-channels.enum';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ADS_ITEM_DETAIL, FactoryAdAffiliationSlotConfiguration, ItemDetailAdSlotsConfiguration } from '../core/ads/item-detail-ads.config';
import { ItemDetailFlagsStoreService } from '../core/services/item-detail-flags-store/item-detail-flags-store.service';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailTrackEventsService } from '../core/services/item-detail-track-events/item-detail-track-events.service';
import { ItemSocialShareService } from '../core/services/item-social-share/item-social-share.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { RecommendedItemsInitEventEmitter } from '../interfaces/recommended-items-init-event-emitter.interface';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ItemFullScreenCarouselComponent, { static: true })
  itemDetailImagesModal: ItemFullScreenCarouselComponent;
  public recommendedItems$: Observable<ItemCardsWithRecommenedType>;
  public readonly deviceType: typeof DeviceType = DeviceType;
  public device: DeviceType;
  public adsSlotsItemDetail: ItemDetailAdSlotsConfiguration = ADS_ITEM_DETAIL;
  public adsAffiliationSlotConfiguration: AdSlotConfiguration[];
  public adsAffiliationsLoaded$: Observable<boolean>;
  public renderMap = false;
  private subscriptions: Subscription = new Subscription();
  private itemDetail: ItemDetail;

  public readonly PERMISSIONS = PERMISSIONS;

  constructor(
    private itemDetailStoreService: ItemDetailStoreService,
    private deviceService: DeviceService,
    private itemDetailTrackEventsService: ItemDetailTrackEventsService,
    private route: ActivatedRoute,
    private adsService: AdsService,
    private itemSocialShareService: ItemSocialShareService,
    private typeCheckService: TypeCheckService,
    private userService: UserService,
    private itemDetailFlagsStoreService: ItemDetailFlagsStoreService,
    private recommenderItemCardFavouriteCheckedService: RecommenderItemCardFavouriteCheckedService,
    private isCurrentUser: IsCurrentUserPipe
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    this.adsAffiliationSlotConfiguration = FactoryAdAffiliationSlotConfiguration(this.device);

    const observables: Observable<boolean>[] = this.adsAffiliationSlotConfiguration.map((adSlot: AdSlotConfiguration) =>
      this.adsService.adSlotLoaded$(adSlot)
    );
    this.adsAffiliationsLoaded$ = combineLatest(observables).pipe(
      map((adsLoaded: boolean[]) => adsLoaded.some((loaded: boolean) => loaded))
    );
    // TBD the url may change to match one more similar to production one
    this.initPage(this.route.snapshot.paramMap.get(PUBLIC_PATH_PARAMS.ID));
  }

  ngOnDestroy(): void {
    this.itemDetailStoreService.clear();
    this.subscriptions.unsubscribe();
  }

  public openItemDetailImage($event: CarouselSlide): void {
    this.itemDetailImagesModal.images = this.itemDetail.bigImages;
    this.itemDetailImagesModal.item = this.itemDetail.item;
    this.itemDetailImagesModal.imageIndex = $event?.index;
    this.itemDetailImagesModal.show();
  }

  public toggleReserveItem(): void {
    this.itemDetailStoreService.toggleReservedItem().subscribe();
  }

  public toggleFavouriteItem(): void {
    this.itemDetailStoreService.toggleFavouriteItem().subscribe(() => {
      this.itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent(this.itemDetail.item, this.itemDetail.user?.featured);
    });
  }

  public soldItem(): void {
    this.itemDetailStoreService.markItemAsSold();
  }

  public trackClickItemCardEvent(event: ClickedItemCard): void {
    const recommendedItemCard: ItemCard = event.itemCard;
    const sourceItem: Item = this.itemDetail.item;
    this.userService.get(recommendedItemCard.ownerId).subscribe((recommendedUser: User) => {
      this.itemDetailTrackEventsService.trackClickItemCardEvent(recommendedItemCard, sourceItem, recommendedUser, event.index);
    });
  }

  public trackShareItemEvent(channel: SOCIAL_SHARE_CHANNELS): void {
    this.itemDetailTrackEventsService.trackShareItemEvent(channel, this.itemDetail.item, this.itemDetail.user);
  }

  public trackViewItemDetailRecommendationSlider({ recommendedItemIds, engine }: RecommendedItemsInitEventEmitter) {
    if (this.itemDetail) {
      this.itemDetailTrackEventsService.trackViewItemDetailRecommendationSliderEvent(
        this.itemDetail.item,
        this.itemDetail.user,
        recommendedItemIds,
        engine
      );
    }
  }

  public onMapContainerVisible(): void {
    const { coordinate, haveCoordinates } = this.itemDetail;
    this.renderMap = haveCoordinates && !!coordinate;
  }

  private initPage(itemId: string): void {
    this.itemDetailStoreService.initializeItemAndFlags(itemId);
    const subscription: Subscription = this.itemDetailStoreService.itemDetail$
      .pipe(filter((itemDetail: ItemDetail) => !!itemDetail))
      .subscribe((itemDetail: ItemDetail) => {
        if (!this.itemDetail) {
          this.adsService.setAdKeywords({ category: itemDetail.item.categoryId.toString() });
          this.initializeItemRecommendations(itemId, itemDetail.item.categoryId);
          this.itemSocialShareService.initializeItemMetaTags(itemDetail.item);
          this.trackViewEvents(itemDetail);
        }
        this.itemDetail = itemDetail;
      });
    this.subscriptions.add(subscription);
  }

  private initializeItemRecommendations(itemId: string, categoryId: number): void {
    if (this.isItemRecommendations(categoryId)) {
      this.recommendedItems$ = this.recommenderItemCardFavouriteCheckedService.getItems(itemId);
    }
  }

  private isItemRecommendations(itemCategoryId: number): boolean {
    const CATEGORIES_WITH_RECOMMENDATIONS = [CATEGORY_IDS.CAR, CATEGORY_IDS.FASHION_ACCESSORIES];
    return CATEGORIES_WITH_RECOMMENDATIONS.includes(itemCategoryId);
  }

  private trackViewEvents(itemDetail: ItemDetail): void {
    const item = itemDetail.item;
    const user = itemDetail.user;
    const isCurrentUser = this.isCurrentUser.transform(user.id);

    if (isCurrentUser) {
      this.itemDetailTrackEventsService.trackViewOwnItemDetail(item, user);
    } else {
      if (this.typeCheckService.isRealEstate(item)) {
        this.itemDetailTrackEventsService.trackViewOthersItemREDetailEvent(item, user);
      }
      if (this.typeCheckService.isCar(item)) {
        this.itemDetailTrackEventsService.trackViewOthersItemCarDetailEvent(item, user);
      }
      if (!this.typeCheckService.isRealEstate(item) && !this.typeCheckService.isCar(item)) {
        this.itemDetailTrackEventsService.trackViewOthersCGDetailEvent(item, user);
      }
    }
  }

  get itemDetail$(): Observable<ItemDetail> {
    return this.itemDetailStoreService.itemDetail$.pipe(filter((itemDetail: ItemDetail) => !!itemDetail?.item));
  }

  get statusFlag$(): Observable<STATUS_ITEM_FLAG_TYPES> {
    return this.itemDetailFlagsStoreService.statusFlag$;
  }

  get bumpedFlag$(): Observable<BUMPED_ITEM_FLAG_TYPES> {
    return this.itemDetailFlagsStoreService.bumpedFlag$;
  }
}
