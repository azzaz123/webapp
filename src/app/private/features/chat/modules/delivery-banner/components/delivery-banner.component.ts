import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DELIVERY_BANNER_TYPE } from '../enums/delivery-banner-type.enum';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';

@Component({
  selector: 'tsl-delivery-banner',
  templateUrl: './delivery-banner.component.html',
  styleUrls: ['./delivery-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
  public readonly DELIVERY_BANNER_TYPES: DELIVERY_BANNER_TYPE;

  public handleClickCTA(action: DELIVERY_BANNER_ACTION): void {
    this.clickedCTA.emit(action);
  }
}
