import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DELIVERY_BANNER_ACTION } from '../../../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

@Component({
  selector: 'tsl-buyer-buy-banner',
  templateUrl: './buyer-buy-banner.component.html',
  styleUrls: ['./buyer-buy-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerBuyBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();

  public handleClickBuy(): void {
    this.clickedCTA.emit(this.bannerProperties.action);
  }
}
