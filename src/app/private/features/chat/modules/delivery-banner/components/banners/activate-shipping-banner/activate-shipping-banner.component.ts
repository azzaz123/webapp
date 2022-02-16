import { Component } from '@angular/core';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';

@Component({
  selector: 'tsl-activate-shipping-banner',
  templateUrl: './activate-shipping-banner.component.html',
  styleUrls: ['./activate-shipping-banner.component.scss'],
})
export class ActivateShippingBannerComponent extends ActionableDeliveryBannerComponent {
  public readonly ACTIVATE_SHIPPING_ICON_URL: string = 'assets/icons/shipping-available.svg';
}
