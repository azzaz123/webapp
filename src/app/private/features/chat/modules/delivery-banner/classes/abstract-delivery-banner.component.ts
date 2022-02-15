import { Directive, Input } from '@angular/core';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';

@Directive()
export abstract class AbstractDeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner;
}
