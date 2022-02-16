import { Component, OnInit } from '@angular/core';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ActionableDeliveryBannerComponent } from '../../../classes/actionable-delivery-banner.component';

@Component({
  selector: 'tsl-activate-shipping-banner',
  templateUrl: './activate-shipping-banner.component.html',
  styleUrls: ['./activate-shipping-banner.component.scss'],
})
export class ActivateShippingBannerComponent extends ActionableDeliveryBannerComponent implements OnInit {
  public readonly ACTIVATE_SHIPPING_ICON_URL: string = 'assets/icons/shipping-available.svg';
  public ACTIVATE_SHIPPING_HELP_URL: string;

  constructor(private customerHelpService: CustomerHelpService) {
    super();
  }

  ngOnInit(): void {
    this.ACTIVATE_SHIPPING_HELP_URL = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING);
  }
}
