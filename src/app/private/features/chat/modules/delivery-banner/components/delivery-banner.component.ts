import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { DELIVERY_BANNER_ACTION_TYPE } from '../enums/delivery-banner-action-type.enum';
import { ActionableDeliveryBanner } from '../interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '../interfaces/descriptive-delivery-banner.interface';

@Component({
  selector: 'tsl-delivery-banner',
  templateUrl: './delivery-banner.component.html',
  styleUrls: ['./delivery-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryBannerComponent implements OnChanges {
  @Input() bannerProperties: DeliveryBanner | DescriptiveDeliveryBanner | ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION_TYPE> = new EventEmitter<DELIVERY_BANNER_ACTION_TYPE>();

  public showCTA: boolean = false;
  public showLink: boolean = false;

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };

  public ngOnChanges(): void {
    this.showCTA = this.isActionableBannerProperties(this.bannerProperties);
    this.showLink = this.isDescriptiveBannerProperties(this.bannerProperties);
  }

  public handleClickCTA(): void {
    if (this.isActionableBannerProperties(this.bannerProperties)) {
      this.clickedCTA.emit(this.bannerProperties.action.type);
    }
  }

  private isDescriptiveBannerProperties(
    input: DeliveryBanner | DescriptiveDeliveryBanner | ActionableDeliveryBanner
  ): input is DescriptiveDeliveryBanner {
    return (input as DescriptiveDeliveryBanner).description?.helpLink !== undefined;
  }

  private isActionableBannerProperties(
    input: DeliveryBanner | DescriptiveDeliveryBanner | ActionableDeliveryBanner
  ): input is ActionableDeliveryBanner {
    return (input as ActionableDeliveryBanner).action !== undefined;
  }
}
