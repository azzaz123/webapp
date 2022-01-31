import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';

@Component({
  selector: 'tsl-delivery-banner',
  templateUrl: './delivery-banner.component.html',
  styleUrls: ['./delivery-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner;

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
}
