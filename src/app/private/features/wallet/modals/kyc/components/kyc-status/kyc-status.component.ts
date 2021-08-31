import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { KYCModalStatus } from '../../interfaces/kyc-modal-status.interface';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
})
export class KYCStatusComponent {
  @Input() properties: KYCModalStatus;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  public KYC_HELP_URL: string = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING);

  constructor(private customerHelpService: CustomerHelpService) {}
}
