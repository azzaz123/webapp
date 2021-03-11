import { Injectable } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Image, UserLocation } from '@core/user/user-response.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { CounterSpecifications } from '@public/features/item-detail/components/item-specifications/interfaces/item.specifications.interface';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { SocialShare } from '@public/features/item-detail/interfaces/social-share.interface';
import { ItemDetailLocation } from '@public/features/item-detail/pages/constants/item-detail.interface';
import { MapExtraInfoService } from '../map-extra-info/map-extra-info.service';
import { MapSpecificationsService } from '../map-specifications/map-specifications.service';

@Injectable()
export class MapItemDetailStoreService {
  private itemDetailResponse: ItemDetailResponse;

  constructor(
    private typeCheckService: TypeCheckService,
    private mapSpecificationsService: MapSpecificationsService,
    private mapExtraInfoService: MapExtraInfoService
  ) {}

  public mapItemDetailStore(itemDetailResponse: ItemDetailResponse): ItemDetail {
    this.itemDetailResponse = itemDetailResponse;
    return {
      item: itemDetailResponse.item,
      user: itemDetailResponse.user,
      specifications: this.itemSpecifications,
      images: this.itemImages,
      bigImages: this.itemBigImages,
      coordinate: this.coordinate,
      location: this.itemLocation,
      locationSpecifications: this.locationSpecifications,
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

  private get itemSpecifications(): CounterSpecifications[] {
    return this.mapSpecificationsService.mapSpecification(this.itemDetailResponse?.item);
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
