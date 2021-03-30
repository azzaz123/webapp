import { Observable, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { CarouselSlide } from '@public/shared/components/carousel-slides/carousel-slide.interface';
import { ADS_ITEM_DETAIL, ItemDetailAdSlotsConfiguration } from './../core/ads/item-detail-ads.config';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { ItemSocialShareService } from '../core/services/item-social-share/item-social-share.service';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag-constants';
import { ItemDetailFlagsStoreService } from '../core/services/item-detail-flags-store/item-detail-flags-store.service';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ViewOwnItemDetail,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
  ViewOthersItemCGDetail,
  ViewOthersItemCarDetail,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { finalize } from 'rxjs/operators';
import { Car } from '@core/item/car';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ItemFullScreenCarouselComponent, { static: true })
  itemDetailImagesModal: ItemFullScreenCarouselComponent;
  public adsSlotsItemDetail: ItemDetailAdSlotsConfiguration = ADS_ITEM_DETAIL;
  public recommendedItems$: Observable<RecommendedItemsBodyResponse>;
  public readonly deviceType = DeviceType;
  public device: DeviceType;
  private subscriptions: Subscription[] = [];
  private itemDetail: ItemDetail;

  constructor(
    private itemDetailStoreService: ItemDetailStoreService,
    private deviceService: DeviceService,
    private itemDetailService: ItemDetailService,
    private route: ActivatedRoute,
    private adsService: AdsService,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private itemSocialShareService: ItemSocialShareService,
    private typeCheckService: TypeCheckService,
    private itemDetailFlagsStoreService: ItemDetailFlagsStoreService
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    // TBD the url may change to match one more similar to production one
    this.initPage(this.route.snapshot.paramMap.get(PUBLIC_PATH_PARAMS.ID));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
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
      this.trackFavoriteOrUnfavoriteEvent();
    });
  }

  public soldItem(): void {
    this.itemDetailStoreService.markItemAsSold();
  }

  private trackFavoriteOrUnfavoriteEvent(): void {
    const event: AnalyticsEvent<FavoriteItem | UnfavoriteItem> = {
      name: this.itemDetail.item.flags.favorite ? ANALYTICS_EVENT_NAMES.FavoriteItem : ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: this.itemDetail.item.id,
        categoryId: this.itemDetail.item.categoryId,
        screenId: SCREEN_IDS.ItemDetail,
        salePrice: this.itemDetail.item.salePrice,
        isPro: this.itemDetail.user.featured,
        title: this.itemDetail.item.title,
        isBumped: !!this.itemDetail.item.bumpFlags,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private initPage(itemId: string): void {
    this.itemDetailStoreService.initializeItemAndFlags(itemId);
    this.subscriptions.push(
      this.itemDetailStoreService.itemDetail$.subscribe((itemDetail: ItemDetail) => {
        if (itemDetail && !this.itemDetail) {
          this.setAdSlot(itemDetail.item);
          this.initializeItemRecommendations(itemId, itemDetail.item.categoryId);
          this.itemSocialShareService.initializeItemMetaTags(itemDetail.item);
          this.trackViewEvents(itemDetail);
        }
        this.itemDetail = itemDetail;
      })
    );
  }

  private initializeItemRecommendations(itemId: string, categoryId: number): void {
    if (this.isItemRecommendations(categoryId)) {
      this.recommendedItems$ = this.itemDetailService.getRecommendedItems(itemId);
    }
  }

  private setAdSlot(item: Item): void {
    this.adsService.setAdKeywords({ category: item.categoryId.toString() });
    this.adsService.setSlots([this.adsSlotsItemDetail?.item1, this.adsSlotsItemDetail?.item2l, this.adsSlotsItemDetail?.item3r]);
  }

  private isItemRecommendations(itemCategoryId: number): boolean {
    const CATEGORIES_WITH_RECOMMENDATIONS = [CATEGORY_IDS.CAR, CATEGORY_IDS.FASHION_ACCESSORIES];
    return CATEGORIES_WITH_RECOMMENDATIONS.includes(itemCategoryId);
  }

  private trackViewEvents(itemDetail: ItemDetail): void {
    const item = itemDetail.item;
    const user = itemDetail.user;
    this.userService.me().subscribe((userMe: User) => {
      if (user.id === userMe.id) {
        const event: AnalyticsPageView<ViewOwnItemDetail> = {
          name: ANALYTICS_EVENT_NAMES.ViewOwnItemDetail,
          attributes: {
            itemId: item.id,
            categoryId: item.categoryId,
            salePrice: item.salePrice,
            title: item.title,
            isPro: user.featured,
            screenId: SCREEN_IDS.ItemDetail,
            isActive: !item.flags?.onhold,
          },
        };
        this.analyticsService.trackPageView(event);
      } else {
        if (this.typeCheckService.isCar(itemDetail.item)) {
          this.trackViewOthersItemCarDetailEvent(itemDetail);
        }
        if (!this.typeCheckService.isRealEstate(itemDetail.item) || !this.typeCheckService.isCar(itemDetail.item)) {
          this.trackViewOthersCGDetailEvent(itemDetail);
        }
      }
    });
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

  private trackViewOthersItemCarDetailEvent(itemDetail: ItemDetail): void {
    const item = itemDetail.item as Car;
    const user = itemDetail.user;
    const event: AnalyticsPageView<ViewOthersItemCarDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOthersItemCarDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        brand: item.brand,
        model: item.model,
        year: item.year,
        km: item.km,
        gearbox: item.gearbox,
        engine: item.engine,
        colour: item.color,
        hp: item.horsepower,
        numDoors: item.numDoors,
        bodyType: item.bodyType,
        isCarDealer: false,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
      },
    };
    this.userService
      .isProfessional()
      .pipe(
        finalize(() => {
          this.analyticsService.trackPageView(event);
        })
      )
      .subscribe((isCarDealer: boolean) => {
        event.attributes.isCarDealer = isCarDealer;
      });
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
