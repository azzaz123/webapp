import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';
import { DELIVERY_BANNER_ACTION } from '../../../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

@Component({
  selector: 'tsl-buy-banner',
  templateUrl: './buy-banner.component.html',
  styleUrls: ['./buy-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyBannerComponent implements ActionableDeliveryBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner;
  @Output() clickedCTA: EventEmitter<DELIVERY_BANNER_ACTION> = new EventEmitter<DELIVERY_BANNER_ACTION>();

  public readonly bannerStyleProperties: BannerSpecifications = {
    dismissible: false,
    type: 'info',
    isFullHeight: true,
  };

  public readonly lotties: string[] = [
    'https://prod-delivery-resources.wallapop.com/chat-banner/box.json',
    'https://prod-delivery-resources.wallapop.com/chat-banner/protect.json',
    'https://prod-delivery-resources.wallapop.com/chat-banner/lock.json',
  ];

  public readonly lottie: string = this.lotties[0];

  public handleClickBuy(): void {
    this.clickedCTA.emit(this.bannerProperties.action);
  }
}
