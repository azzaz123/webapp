import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdSlot } from '@core/ads/models';
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
import { finalize } from 'rxjs/operators';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { CounterSpecifications } from '../components/item-specifications/interfaces/item.specifications.interface';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { MapSpecificationsService } from '../core/services/map-specifications/map-specifications.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { AD_TOP_ITEM_DETAIL } from './../core/ads/item-detail-ads.config';
import { ItemDetailLocation } from './constants/item-detail.interface';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  @ViewChild(ItemFullScreenCarouselComponent, { static: true })
  itemDetailImagesModal: ItemFullScreenCarouselComponent;
  public readonly deviceType = DeviceType;
  public loading = true;
  public isApproximateLocation = false;
  public showItemRecommendations = false;
  public locationSpecifications: string;
  public coordinates: Coordinate;
  public device: DeviceType;
  public images: string[];
  public bigImages: string[];
  public itemLocation: ItemDetailLocation;
  public recommendedItems$: Observable<RecommendedItemsBodyResponse>;
  public itemSpecifications: CounterSpecifications[];
  public itemDetail: ItemDetail;
  public adSlot: AdSlot;

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
    private deviceService: DeviceService,
    private itemDetailService: ItemDetailService,
    private socialMetaTagsService: SocialMetaTagService,
    private route: ActivatedRoute,
    private router: Router,
    private mapSpecificationsService: MapSpecificationsService,
    private typeCheckService: TypeCheckService,
    private adsService: AdsService
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
    this.itemDetailImagesModal.images = this.bigImages;
    this.itemDetailImagesModal.item = this.itemDetail?.item;
    this.itemDetailImagesModal.imageIndex = $event?.index;
    this.itemDetailImagesModal.show();
  }

  private initPage(itemId: string): void {
    this.recommendedItems$ = this.itemDetailService.getRecommendedItems(itemId);
    this.itemDetailService
      .getItem(itemId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (itemDetail: ItemDetail) => {
          this.itemDetail = itemDetail;
          this.handleItemSpecifications();
        },
        () => {
          this.router.navigate([`/${APP_PATHS.NOT_FOUND}`]);
        }
      );
  }

  private handleItemSpecifications(): void {
    this.calculateItemCoordinates();
    this.showItemImages();
    this.socialShareSetup(this.itemDetail.item);
    this.generateItemSpecifications();
    this.setItemRecommendations();
    this.setAdSlot();
  }

  private calculateItemCoordinates(): void {
    const detailLocation: UserLocation = this.itemDetail.item?.location || this.itemDetail.user?.location;
    this.itemLocation = {
      zip: detailLocation.zip || detailLocation.postal_code,
      city: detailLocation.city,
      latitude: detailLocation.approximated_latitude,
      longitude: detailLocation.approximated_longitude,
    };

    this.approximatedLocation = detailLocation.approximated_location;
    this.coordinates = {
      latitude: this.itemLocation.latitude,
      longitude: this.itemLocation.longitude,
    };
    this.calculateItemLocationSpecifications();
  }

  private showItemImages(): void {
    this.images = [];
    this.bigImages = [];
    this.itemDetail.item?.images?.forEach((image: Image) => {
      this.images.push(image.urls_by_size.large);
      this.bigImages.push(image.urls_by_size.xlarge);
    });
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

  private calculateItemLocationSpecifications(): void {
    this.locationSpecifications =
      !!this.itemLocation?.zip && !!this.itemLocation?.city
        ? `${this.itemLocation.zip}, ${this.itemLocation.city}`
        : $localize`:@@Undefined:Undefined`;
  }

  private setItemRecommendations(): void {
    const CATEGORIES_WITH_RECOMMENDATIONS = [CATEGORY_IDS.CAR, CATEGORY_IDS.FASHION_ACCESSORIES];

    this.showItemRecommendations = CATEGORIES_WITH_RECOMMENDATIONS.includes(this.itemDetail?.item?.categoryId);
  }

  private generateItemSpecifications(): void {
    if (this.typeCheckService.isCar(this.itemDetail?.item)) {
      this.itemSpecifications = this.mapSpecificationsService.mapCarSpecifications(this.itemDetail?.item);
    } else if (this.typeCheckService.isRealEstate(this.itemDetail?.item)) {
      this.itemSpecifications = this.mapSpecificationsService.mapRealestateSpecifications(this.itemDetail?.item);
    }
  }

  set approximatedLocation(isApproximated: boolean) {
    this.isApproximateLocation = isApproximated;
  }

  private setAdSlot(): void {
    this.adSlot = { ...AD_TOP_ITEM_DETAIL };
    this.adsService.setAdKeywords({ category: this.itemDetail.item.categoryId.toString() });
    this.adsService.setSlots([this.adSlot]);
  }
}
