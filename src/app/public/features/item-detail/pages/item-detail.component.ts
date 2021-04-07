import { AnalyticsService } from '@core/analytics/analytics.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewOthersItemCGDetail } from '@core/analytics/analytics-constants';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { CarouselSlide } from '@public/shared/components/carousel-slides/carousel-slide.interface';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag-constants';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ItemDetailFlagsStoreService } from '../core/services/item-detail-flags-store/item-detail-flags-store.service';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailTrackEventsService } from '../core/services/item-detail-track-events/item-detail-track-events.service';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { ItemSocialShareService } from '../core/services/item-social-share/item-social-share.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import {
  ADS_ITEM_DETAIL,
  FactoryAdAffiliationSlotConfiguration,
  ItemDetailAdSlotsConfiguration,
} from './../core/ads/item-detail-ads.config';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ItemFullScreenCarouselComponent, { static: true })
  itemDetailImagesModal: ItemFullScreenCarouselComponent;
  public recommendedItems$: Observable<RecommendedItemsBodyResponse>;
  public readonly deviceType: typeof DeviceType = DeviceType;
  public device: DeviceType;
  private subscriptions: Subscription = new Subscription();
  private itemDetail: ItemDetail;
  public adsSlotsItemDetail: ItemDetailAdSlotsConfiguration = ADS_ITEM_DETAIL;
  public adsAffiliationSlotConfiguration: AdSlotConfiguration[];
  public adsAffiliationsLoaded$: Observable<boolean>;

  constructor(
    private itemDetailStoreService: ItemDetailStoreService,
    private deviceService: DeviceService,
    private itemDetailService: ItemDetailService,
    private itemDetailTrackEventsService: ItemDetailTrackEventsService,
    private route: ActivatedRoute,
    private adsService: AdsService,
    private itemSocialShareService: ItemSocialShareService,
    private typeCheckService: TypeCheckService,
    private userService: UserService,
    private itemDetailFlagsStoreService: ItemDetailFlagsStoreService,
    private analyticsService: AnalyticsService
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
      this.itemDetailTrackEventsService.trackFavoriteOrUnfavoriteEvent(this.itemDetail);
    });
  }

  public soldItem(): void {
    this.itemDetailStoreService.markItemAsSold();
  }

  private initPage(itemId: string): void {
    this.itemDetailStoreService.initializeItemAndFlags(itemId);
    const subscription: Subscription = this.itemDetailStoreService.itemDetail$
      .pipe(filter((itemDetail: ItemDetail) => !!itemDetail))
      .subscribe((itemDetail: ItemDetail) => {
        if (!this.itemDetail) {
          this.setAdSlot(itemDetail);
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
      this.recommendedItems$ = this.itemDetailService.getRecommendedItems(itemId);
    }
  }

  private isItemRecommendations(itemCategoryId: number): boolean {
    const CATEGORIES_WITH_RECOMMENDATIONS = [CATEGORY_IDS.CAR, CATEGORY_IDS.FASHION_ACCESSORIES];
    return CATEGORIES_WITH_RECOMMENDATIONS.includes(itemCategoryId);
  }

  private trackViewEvents(itemDetail: ItemDetail): void {
    const item = itemDetail.item;
    const user = itemDetail.user;
    const subscription: Subscription = this.userService
      .me()
      .pipe(take(1))
      .subscribe((userMe: User) => {
        if (user.id === userMe.id) {
          this.itemDetailTrackEventsService.trackViewOwnItemDetail(item, user);
        } else {
          if (this.typeCheckService.isCar(item)) {
            this.itemDetailTrackEventsService.trackViewOthersItemCarDetailEvent(item, user);
          }
          if (!this.typeCheckService.isRealEstate(item) && !this.typeCheckService.isCar(item)) {
            this.itemDetailTrackEventsService.trackViewOthersCGDetailEvent(item, user);
          }
        }
      });

    this.subscriptions.add(subscription);
  }

  private setAdSlot({ item }: ItemDetail): void {
    this.adsService.setAdKeywords({ category: item.categoryId.toString() });
    this.adsService.setSlots([
      this.adsSlotsItemDetail.item1,
      this.adsSlotsItemDetail.item2l,
      this.adsSlotsItemDetail.item3r,
      ...this.adsAffiliationSlotConfiguration,
    ]);
  }

  private trackViewOthersCGDetailEvent(itemDetail: ItemDetail): void {
    const item = itemDetail.item;
    const user = itemDetail.user;
    const event: AnalyticsPageView<ViewOthersItemCGDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOthersItemCGDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        title: item.title,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  get itemDetail$(): Observable<ItemDetail> {
    return this.itemDetailStoreService.itemDetail$;
  }

  get statusFlag$(): Observable<STATUS_ITEM_FLAG_TYPES> {
    return this.itemDetailFlagsStoreService.statusFlag$;
  }

  get bumpedFlag$(): Observable<BUMPED_ITEM_FLAG_TYPES> {
    return this.itemDetailFlagsStoreService.bumpedFlag$;
  }
}
