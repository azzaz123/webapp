import { Injectable } from '@angular/core';
import { CategoryService } from '@core/category/category.service';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Image, UserLocation } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { CounterSpecifications } from '@public/features/item-detail/components/item-specifications/interfaces/item.specifications.interface';
import { ItemTaxonomies } from '@public/features/item-detail/components/item-taxonomies/interfaces/item-taxonomies.interface';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { SocialShare } from '@public/features/item-detail/interfaces/social-share.interface';
import { ItemDetailLocation } from '@public/features/item-detail/pages/constants/item-detail.interface';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { ItemDetailRoutePipe } from '@shared/pipes';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapExtraInfoService } from '../map-extra-info/map-extra-info.service';
import { MapSpecificationsService } from '../map-specifications/map-specifications.service';

@Injectable()
export class MapItemDetailStoreService {
  private itemDetailResponse: ItemDetailResponse;

  constructor(
    private typeCheckService: TypeCheckService,
    private mapSpecificationsService: MapSpecificationsService,
    private mapExtraInfoService: MapExtraInfoService,
    private publicProfileService: PublicProfileService,
    private categoryService: CategoryService,
    private itemDetailRoutePipe: ItemDetailRoutePipe
  ) {}

  public mapItemDetailStore(itemDetailResponse: ItemDetailResponse): ItemDetail {
    this.itemDetailResponse = itemDetailResponse;
    return {
      item: itemDetailResponse.item,
      user: itemDetailResponse.user,
      images: this.getItemImages(),
      bigImages: this.getItemBigImages(),
      coordinate: this.getCoordinate(),
      location: this.getItemLocation(),
      locationSpecifications: this.getLocationSpecifications(),
      taxonomiesSpecifications: this.getTaxonomiesSpecifications(),
      counterSpecifications: this.getCounterSpecifications(),
      userStats: this.getUserStats(),
      extraInfo: this.getItemExtraInfo(),
      haveCoordinates: this.getLocationHaveCoordinates(),
      isApproximatedLocation: this.getIsApproximatedLocation(),
      isItemACar: this.typeCheckService.isCar(itemDetailResponse.item),
      isItemAPhone: this.typeCheckService.isCellPhoneAccessories(itemDetailResponse.item),
      isAFashionItem: this.typeCheckService.isFashion(itemDetailResponse.item),
      socialShare: this.getSocialShare(),
    };
  }

  private getLocationHaveCoordinates(): boolean {
    const itemLocation = this.getItemLocation();

    return !!itemLocation?.latitude && !!itemLocation?.longitude;
  }

  private getItemImages(): string[] {
    const itemImages = this.itemDetailResponse?.item?.images;
    const images: string[] = [];

    itemImages?.forEach((image: Image) => {
      images.push(image.urls_by_size.large);
    });

    return images;
  }

  private getItemBigImages(): string[] {
    const bigImages: string[] = [];

    this.itemDetailResponse?.item?.images?.forEach((image: Image) => {
      bigImages.push(image.urls_by_size.xlarge);
    });

    return bigImages;
  }

  private getCounterSpecifications(): CounterSpecifications[] {
    return this.mapSpecificationsService.mapSpecification(this.itemDetailResponse?.item);
  }

  private getUserStats(): Observable<UserStats> {
    return this.publicProfileService.getStats(this.itemDetailResponse?.user?.id);
  }

  private getItemExtraInfo(): string[] {
    return this.mapExtraInfoService.mapExtraInfo(this.itemDetailResponse?.item);
  }

  private getItemLocation(): ItemDetailLocation {
    const detailLocation: UserLocation = this.itemDetailResponse?.item?.location || this.itemDetailResponse?.user?.location;

    return {
      zip: detailLocation?.zip || detailLocation?.postal_code,
      city: detailLocation?.city,
      latitude: detailLocation?.approximated_latitude,
      longitude: detailLocation?.approximated_longitude,
    };
  }

  private getTaxonomiesSpecifications(): Observable<ItemTaxonomies> {
    const parentTaxonomy = this.itemDetailResponse?.item?.extraInfo?.object_type?.parent_object_type?.name;
    const defaultTaxonomy = this.itemDetailResponse?.item?.extraInfo?.object_type?.name;
    const taxonomies: ItemTaxonomies = {
      parentTaxonomy: null,
      childTaxonomy: null,
      icon: null,
    };

    if (!defaultTaxonomy) {
      return of(taxonomies);
    } else {
      return this.categoryService.getCategoryIconById(this.itemDetailResponse?.item?.categoryId).pipe(
        map((icon: string) => {
          taxonomies.icon = icon;
          taxonomies.parentTaxonomy = parentTaxonomy || defaultTaxonomy;
          taxonomies.childTaxonomy = parentTaxonomy ? defaultTaxonomy : null;
          return taxonomies;
        })
      );
    }
  }

  private getLocationSpecifications(): string {
    const itemLocation = this.getItemLocation();

    return !!itemLocation?.zip && !!itemLocation?.city
      ? `${itemLocation.zip}, ${itemLocation.city}`
      : $localize`:@@web_undefined:Undefined`;
  }

  private getCoordinate(): Coordinate {
    const itemLocation = this.getItemLocation();

    return {
      latitude: itemLocation?.latitude,
      longitude: itemLocation?.longitude,
    };
  }

  private getIsApproximatedLocation(): boolean {
    const detailLocation: UserLocation = this.itemDetailResponse?.item?.location || this.itemDetailResponse?.user?.location;
    return !!detailLocation?.approximated_location;
  }

  private getSocialShare(): SocialShare {
    const itemLink = this.itemDetailRoutePipe.transform(this.itemDetailResponse?.item.webSlug);

    return {
      title: $localize`:@@web_item_detail_share_title:Share this product with your friends`,
      facebook: {
        url: itemLink,
      },
      twitter: {
        url: itemLink,
        text: $localize`:@@web_item_detail_share_twitter_text:Look what I found @wallapop:`,
      },
      email: {
        url: itemLink,
        subject: this.itemDetailResponse?.item.title,
        message: $localize`:@@web_item_detail_share_email_text:This may interest you - ` + this.itemDetailResponse?.item.description,
      },
    };
  }
}
