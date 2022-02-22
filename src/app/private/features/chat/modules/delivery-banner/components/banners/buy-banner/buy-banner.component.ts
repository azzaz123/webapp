import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

@Component({
  selector: 'tsl-buy-banner',
  templateUrl: './buy-banner.component.html',
  styleUrls: ['./buy-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyBannerComponent extends ActionableDeliveryBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner;

  public readonly lotties: string[] = [
    'https://prod-delivery-resources.wallapop.com/chat-banner/box.json',
    'https://prod-delivery-resources.wallapop.com/chat-banner/protect.json',
    'https://prod-delivery-resources.wallapop.com/chat-banner/lock.json',
  ];

  public readonly lottie: string = this.lotties[0];
}
