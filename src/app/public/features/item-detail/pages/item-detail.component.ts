import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Item } from '@core/item/item';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { Image, UserLocation } from '@core/user/user-response.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { CarouselSlide } from '@public/shared/components/carousel-slides/carousel-slide.interface';
import { EmailShare } from '@shared/social-share/interfaces/email-share.interface';
import { FacebookShare } from '@shared/social-share/interfaces/facebook-share.interface';
import { TwitterShare } from '@shared/social-share/interfaces/twitter-share.interface';
import { APP_PATHS } from 'app/app-routing-constants';
import { Observable } from 'rxjs';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { CounterSpecifications } from '../components/item-specifications/interfaces/item.specifications.interface';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { MapExtraInfoService } from '../core/services/map-extra-info/map-extra-info.service';
import { MapSpecificationsService } from '../core/services/map-specifications/map-specifications.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { ItemDetailAdSlotsConfiguration, ADS_ITEM_DETAIL } from './../core/ads/item-detail-ads.config';
import { ItemDetailLocation } from './constants/item-detail.interface';
import { User } from '@core/user/user';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent implements OnInit {
  @ViewChild(ItemFullScreenCarouselComponent, { static: true })
  itemDetailImagesModal: ItemFullScreenCarouselComponent;
  public readonly deviceType = DeviceType;
  public showItemRecommendations = false;
  public device: DeviceType;
  public recommendedItems$: Observable<RecommendedItemsBodyResponse>;
  public itemDetail: ItemDetail;
  public adsSlotsItemDetail: ItemDetailAdSlotsConfiguration = ADS_ITEM_DETAIL;

  public socialShare: {
    title: string;
    facebook: FacebookShare;
    twitter: TwitterShare;
    email: EmailShare;
  } = {
    title: $localize`:@@ItemDetailShareTitle:Share this product with your friends`,
    facebook: null,
    twitter: null,
    email: null,
  };

  constructor(
    public typeCheckService: TypeCheckService,
    public itemDetailStoreService: ItemDetailStoreService,
    private deviceService: DeviceService,
    private itemDetailService: ItemDetailService,
    private socialMetaTagsService: SocialMetaTagService,
    private route: ActivatedRoute,
    private router: Router,
    private mapSpecificationsService: MapSpecificationsService,
    private adsService: AdsService,
    private mapExtraInfoService: MapExtraInfoService
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    // TBD the url may change to match one more similar to production one
    this.initPage(this.route.snapshot.paramMap.get(PUBLIC_PATH_PARAMS.ID));
  }

  public locationHaveCoordinates(): boolean {
    return !!this.itemLocation?.latitude && !!this.itemLocation?.longitude;
  }

  public openItemDetailImage($event: CarouselSlide): void {
    this.itemDetailImagesModal.images = this.itemBigImages;
    this.itemDetailImagesModal.item = this.itemDetail?.item;
    this.itemDetailImagesModal.imageIndex = $event?.index;
    this.itemDetailImagesModal.show();
  }

  public updateReservedItem(reserved: boolean): void {
    const item = this.itemDetailStoreService.item;

    this.itemDetailStoreService.item = new Item(
      item.id,
      item.legacyId,
      item.owner,
      item.title,
      item.description,
      item.categoryId,
      item.location,
      item.salePrice,
      item.currencyCode,
      item.modifiedDate,
      item.url,
      { ...item.flags, reserved },
      item.actionsAllowed,
      item.saleConditions,
      item.mainImage,
      item.images,
      item.webSlug,
      item.publishedDate,
      item.deliveryInfo,
      item.itemType,
      item.extraInfo,
      item.car_info,
      item.km,
      item.bumpFlags
    );
  }

  public updateSoldItem(): void {
    // this.itemDetailStoreService.item = {
    //   ...this.itemDetailStoreService.item,
    //   flags: {
    //     ...this.itemDetailStoreService.item.flags,
    //     sold: true,
    //   },
    // } as Item;
  }

  private initPage(itemId: string): void {
    this.recommendedItems$ = this.itemDetailService.getRecommendedItems(itemId);
    this.itemDetailService.getItem(itemId).subscribe(
      (itemDetail: ItemDetail) => {
        this.initializeItemStore(itemDetail);
        this.handleItemSpecifications();
      },
      () => {
        return this.router.navigate([`/${APP_PATHS.NOT_FOUND}`]);
      }
    );
  }

  private initializeItemStore(itemDetail: ItemDetail): void {
    this.itemDetailStoreService.item = itemDetail?.item;
    this.itemDetailStoreService.user = itemDetail?.user;

    this.itemDetail = {
      user: this.itemDetailStoreService.user,
      item: this.itemDetailStoreService.item,
    };
  }

  private handleItemSpecifications(): void {
    this.socialShareSetup(this.itemDetail?.item);
    this.setAdSlot();
  }

  private socialShareSetup(item: Item): void {
    this.socialShare.facebook = {
      url: item.webLink,
    };

    this.socialShare.twitter = {
      url: item.webLink,
      text: $localize`:@@ItemDetailShareTwitterText:Look what I found @wallapop:`,
    };

    this.socialShare.email = {
      url: item.webLink,
      subject: item.title,
      message: $localize`:@@ItemDetailShareEmailText:This may interest you - ` + item.description,
    };

    this.socialMetaTagsService.insertTwitterMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium);
    this.socialMetaTagsService.insertFacebookMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium, item.webLink);
  }

  private setAdSlot(): void {
    this.adsService.setAdKeywords({ category: this.itemDetail?.item.categoryId.toString() });
    this.adsService.setSlots([this.adsSlotsItemDetail?.item1, this.adsSlotsItemDetail?.item2l, this.adsSlotsItemDetail?.item3r]);
  }

  get item$(): Observable<Item> {
    return this.itemDetailStoreService?.item$;
  }

  get user$(): Observable<User> {
    return this.itemDetailStoreService?.user$;
  }

  get itemImages(): string[] {
    const itemImages = this.itemDetail?.item?.images;
    const images: string[] = [];

    if (!itemImages) {
      return null;
    } else {
      itemImages?.forEach((image: Image) => {
        images.push(image.urls_by_size.large);
      });

      return images;
    }
  }

  get itemBigImages(): string[] {
    const bigImages: string[] = [];

    this.itemDetail?.item?.images?.forEach((image: Image) => {
      bigImages.push(image.urls_by_size.xlarge);
    });

    return bigImages;
  }

  get itemLocation(): ItemDetailLocation {
    const detailLocation: UserLocation = this.itemDetail?.item?.location || this.itemDetail?.user?.location;
    return {
      zip: detailLocation?.zip || detailLocation?.postal_code,
      city: detailLocation?.city,
      latitude: detailLocation?.approximated_latitude,
      longitude: detailLocation?.approximated_longitude,
    };
  }

  get isApproximatedLocation(): boolean {
    const detailLocation: UserLocation = this.itemDetail?.item?.location || this.itemDetail?.user?.location;
    return detailLocation?.approximated_location;
  }

  get coordinates(): Coordinate {
    if (!this.itemLocation) {
      return null;
    }

    return {
      latitude: this.itemLocation?.latitude,
      longitude: this.itemLocation?.longitude,
    };
  }

  get locationSpecifications(): string {
    return !!this.itemLocation?.zip && !!this.itemLocation?.city
      ? `${this.itemLocation.zip}, ${this.itemLocation.city}`
      : $localize`:@@Undefined:Undefined`;
  }

  get itemExtraInfo(): string[] {
    if (this.isCarOrPhoneOrFashion) {
      return this.mapExtraInfoService.mapExtraInfo(this.itemDetail?.item);
    }
  }

  get isCarOrPhoneOrFashion(): boolean {
    return (
      this.typeCheckService.isFashion(this.itemDetail?.item) ||
      this.typeCheckService.isCellPhoneAccessories(this.itemDetail?.item) ||
      this.isItemACar
    );
  }

  get isItemACar(): boolean {
    return this.typeCheckService.isCar(this.itemDetail?.item);
  }

  get itemSpecifications(): CounterSpecifications[] {
    const item = this.itemDetail?.item;
    if (this.typeCheckService.isCar(item)) {
      return this.mapSpecificationsService.mapCarSpecifications(item);
    } else if (this.typeCheckService.isRealEstate(item)) {
      return this.mapSpecificationsService.mapRealestateSpecifications(item);
    }
  }

  get isItemRecommendations(): boolean {
    const CATEGORIES_WITH_RECOMMENDATIONS = [CATEGORY_IDS.CAR, CATEGORY_IDS.FASHION_ACCESSORIES];

    return CATEGORIES_WITH_RECOMMENDATIONS.includes(this.itemDetail?.item?.categoryId);
  }
}
