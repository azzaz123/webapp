import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class DeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION_TYPE> = new EventEmitter<DELIVERY_BANNER_ACTION_TYPE>();

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };

  public handleClickCTA(): void {
    if (this.isActionableBannerProperties(this.bannerProperties)) {
      this.clickedCTA.emit(this.bannerProperties.action.type);
    }
  }

  private isActionableBannerProperties(
    input: DeliveryBanner | DescriptiveDeliveryBanner | ActionableDeliveryBanner
  ): input is ActionableDeliveryBanner {
    return (input as ActionableDeliveryBanner).action.type !== undefined;
  }
}
