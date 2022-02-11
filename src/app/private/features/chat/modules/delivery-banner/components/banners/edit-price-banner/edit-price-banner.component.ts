import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';

@Component({
  selector: 'tsl-edit-price-banner',
  templateUrl: './edit-price-banner.component.html',
  styleUrls: ['./edit-price-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPriceBannerComponent extends ActionableDeliveryBannerComponent {
  public readonly PRICE_NEGOTIATION_ICON_URL = 'assets/icons/price-negotiation.svg';
  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
}
