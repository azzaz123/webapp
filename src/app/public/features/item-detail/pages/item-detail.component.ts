import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ItemDetailLocation } from './constants/item-detail.interface';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Item } from '@core/item/item';
import { ItemFlags } from '@core/item/item-response.interface';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { FacebookShare } from '@shared/social-share/interfaces/facebook-share.interface';
import { TwitterShare } from '@shared/social-share/interfaces/twitter-share.interface';
import { EmailShare } from '@shared/social-share/interfaces/email-share.interface';
import { ItemDetailService } from '../core/services/item-detail.service';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { ActivatedRoute } from '@angular/router';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { UserLocation } from '@core/user/user-response.interface';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  public isApproximateLocation = false;
  public deviceType = DeviceType;
  public device: DeviceType;
  public itemFlags: ItemFlags;
  public images: string[];
  public itemDetail: ItemDetail;
  public itemLocation: ItemDetailLocation;

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    this.initPage(this.route.snapshot.paramMap.get(PUBLIC_PATH_PARAMS.ID)); // TBD the url may change to match one more similar to production one
    this.handleCoordinates();
  }

  private handleCoordinates(): void {
    const detailLocation: UserLocation = this.itemDetail.item?.location
      ? this.itemDetail.item.location
      : this.itemDetail.user.location;

    this.location = {
      zip: detailLocation.zip,
      city: detailLocation.city,
      latitude: detailLocation.approximated_latitude,
      longitude: detailLocation.approximated_longitude,
    };

    this.approximatedLocation = detailLocation.approximated_location;
  }

  private initPage(itemId: string): void {
    this.itemDetailService
      .getItem(itemId)
      .subscribe((itemDetail: ItemDetail) => {
        this.itemDetail = itemDetail;
        this.socialShareSetup(this.itemDetail.item);
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
      message:
        $localize`:@@ItemDetailShareEmailText:This may interest you - ` +
        item.description,
    };

    this.socialMetaTagsService.insertTwitterMetaTags(
      item.title,
      item.description,
      item.mainImage.urls_by_size.medium
    );
    this.socialMetaTagsService.insertFacebookMetaTags(
      item.title,
      item.description,
      item.mainImage.urls_by_size.medium,
      item.webLink
    );
  }

  set location(itemLocation: ItemDetailLocation) {
    this.itemLocation = itemLocation;
  }

  set approximatedLocation(isApproximated: boolean) {
    this.isApproximateLocation = isApproximated;
  }

  get locationHaveCoordinates(): boolean {
    return !!this.itemLocation?.latitude && !!this.itemLocation?.longitude;
  }

  get coordinates(): Coordinate {
    return {
      latitude: this.itemLocation.latitude,
      longitude: this.itemLocation.longitude,
    };
  }

  get locationSpecifications(): string {
    if (!!this.itemLocation?.zip && !!this.itemLocation?.city) {
      return `${this.itemLocation.zip}, ${this.itemLocation.city}`;
    } else {
      return $localize`:@@Undefined:Undefined`;
    }
  }
}
