import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';

@Component({
  selector: 'tsl-payview-delivery-header',
  templateUrl: './payview-delivery-header.component.html',
  styleUrls: ['./payview-delivery-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewDeliveryHeaderComponent {
  constructor(private customerHelpService: CustomerHelpService) {}

  public get helpUrl(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PAYVIEW_DELIVERY);
  }
}
