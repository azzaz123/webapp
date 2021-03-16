import { Observable, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent implements OnInit {
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
    private adsService: AdsService
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

  public reserveItem(itemUUID: string): void {
    this.itemDetailStoreService.markItemAsReserved(itemUUID).subscribe();
  }

  public unreserveItem(itemUUID: string): void {
    this.itemDetailStoreService.markItemAsUnreserved(itemUUID).subscribe();
  }

  public soldItem(): void {
    this.itemDetailStoreService.markItemAsSold();
  }

  private initPage(itemId: string): void {
    this.itemDetailStoreService.initializeItem(itemId);
    this.subscriptions.push(
      this.itemDetailStoreService.itemDetail$.subscribe((itemDetail: ItemDetail) => {
        if (itemDetail) {
          this.itemDetail = itemDetail;
          this.setAdSlot(itemDetail?.item);
          this.initializeItemRecommendations(itemId, itemDetail?.item.categoryId);
        }
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

  get itemDetail$(): Observable<ItemDetail> {
    return this.itemDetailStoreService.itemDetail$;
  }
}
