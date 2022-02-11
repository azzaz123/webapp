import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';
import { DELIVERY_BANNER_ACTION } from '../../../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

@Component({
  selector: 'tsl-edit-price-banner',
  templateUrl: './edit-price-banner.component.html',
  styleUrls: ['./edit-price-banner.component.scss'],
})
export class EditPriceBannerComponent implements ActionableDeliveryBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();
}
