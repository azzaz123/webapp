import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';
import { DELIVERY_BANNER_ACTION } from '../../../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

@Component({
  selector: 'tsl-edit-price-banner',
  templateUrl: './edit-price-banner.component.html',
  styleUrls: ['./edit-price-banner.component.scss'],
})
export class EditPriceBannerComponent extends ActionableDeliveryBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();

  public readonly PRICE_NEGOTIATION_ICON_URL = 'assets/icons/price-negotiation.svg';
  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };
}
