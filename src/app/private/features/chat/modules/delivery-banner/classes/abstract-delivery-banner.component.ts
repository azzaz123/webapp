import { Directive, Input } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';

@Directive()
export abstract class AbstractDeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner;

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
}
