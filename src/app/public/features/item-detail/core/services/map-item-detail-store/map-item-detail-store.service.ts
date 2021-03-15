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
import { Observable } from 'rxjs';
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
    private categoryService: CategoryService
  ) {}

  public mapItemDetailStore(itemDetailResponse: ItemDetailResponse): ItemDetail {
    this.itemDetailResponse = itemDetailResponse;
    return {
      item: itemDetailResponse.item,
      user: itemDetailResponse.user,
      images: this.itemImages,
      bigImages: this.itemBigImages,
      coordinate: this.coordinate,
      location: this.itemLocation,
      locationSpecifications: this.locationSpecifications,
      taxonomiesSpecifications: this.taxonomiesSpecifications,
      counterSpecifications: this.counterSpecifications,
      userStats: this.userStats,
      extraInfo: this.itemExtraInfo,
      haveCoordinates: this.locationHaveCoordinates,
      isApproximatedLocation: this.isApproximatedLocation,
      isItemACar: this.typeCheckService.isCar(itemDetailResponse.item),
      isItemAPhone: this.typeCheckService.isCellPhoneAccessories(itemDetailResponse.item),
      isAFashionItem: this.typeCheckService.isFashion(itemDetailResponse.item),
      socialShare: this.socialShare,
    };
  }

  private get locationHaveCoordinates(): boolean {
    return !!this.itemLocation?.latitude && !!this.itemLocation?.longitude;
  }

  private get itemImages(): string[] {
    const itemImages = this.itemDetailResponse?.item?.images;
    const images: string[] = [];

    itemImages?.forEach((image: Image) => {
      images.push(image.urls_by_size.large);
    });

    return images;
  }

  private get itemBigImages(): string[] {
    const bigImages: string[] = [];

    this.itemDetailResponse?.item?.images?.forEach((image: Image) => {
      bigImages.push(image.urls_by_size.xlarge);
    });

    return bigImages;
  }

  private get counterSpecifications(): CounterSpecifications[] {
    return this.mapSpecificationsService.mapSpecification(this.itemDetailResponse?.item);
  }

  private get userStats(): Observable<UserStats> {
    return this.publicProfileService.getStats(this.itemDetailResponse?.user?.id);
  }

  private get itemExtraInfo(): string[] {
    return this.mapExtraInfoService.mapExtraInfo(this.itemDetailResponse?.item);
  }

  private get itemLocation(): ItemDetailLocation {
    const detailLocation: UserLocation = this.itemDetailResponse?.item?.location || this.itemDetailResponse?.user?.location;
    return {
      zip: detailLocation?.zip || detailLocation?.postal_code,
      city: detailLocation?.city,
      latitude: detailLocation?.approximated_latitude,
      longitude: detailLocation?.approximated_longitude,
    };
  }

  private get taxonomiesSpecifications(): Observable<ItemTaxonomies> {
    const parentTaxonomy = this.itemDetailResponse?.item?.extraInfo?.object_type?.parent_object_type?.name;
    const defaultTaxonomy = this.itemDetailResponse?.item?.extraInfo?.object_type?.name;
    let taxonomies: ItemTaxonomies = {
      parentTaxonomy: null,
      childTaxonomy: null,
      icon: null,
    };

    if (defaultTaxonomy) {
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

  private get locationSpecifications(): string {
    return !!this.itemLocation?.zip && !!this.itemLocation?.city
      ? `${this.itemLocation.zip}, ${this.itemLocation.city}`
      : $localize`:@@Undefined:Undefined`;
  }

  private get coordinate(): Coordinate {
    return {
      latitude: this.itemLocation?.latitude,
      longitude: this.itemLocation?.longitude,
    };
  }

  private get isApproximatedLocation(): boolean {
    const detailLocation: UserLocation = this.itemDetailResponse?.item?.location || this.itemDetailResponse?.user?.location;
    return detailLocation?.approximated_location;
  }

  private get socialShare(): SocialShare {
    return {
      title: $localize`:@@ItemDetailShareTitle:Share this product with your friends`,
      facebook: {
        url: this.itemDetailResponse?.item.webLink,
      },
      twitter: {
        url: this.itemDetailResponse?.item.webLink,
        text: $localize`:@@ItemDetailShareTwitterText:Look what I found @wallapop:`,
      },
      email: {
        url: this.itemDetailResponse?.item.webLink,
        subject: this.itemDetailResponse?.item.title,
        message: $localize`:@@ItemDetailShareEmailText:This may interest you - ` + this.itemDetailResponse?.item.description,
      },
    };
  }
}
