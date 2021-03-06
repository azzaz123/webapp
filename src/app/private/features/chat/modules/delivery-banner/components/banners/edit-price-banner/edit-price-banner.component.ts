import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';

@Component({
  selector: 'tsl-edit-price-banner',
  templateUrl: './edit-price-banner.component.html',
  styleUrls: ['./edit-price-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPriceBannerComponent extends ActionableDeliveryBannerComponent {
  public readonly PRICE_NEGOTIATION_ICON_URL: string = 'assets/icons/price-negotiation.svg';
}
