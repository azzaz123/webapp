import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CUSTOMER_TICKET_FORM } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { KYCModalProperties } from '../../interfaces/kyc-modal-properties.interface';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
})
export class KYCStatusComponent {
  @Input() properties: KYCModalProperties;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  public HELP_FORM_URL: string = this.customerHelpService.getFormPageUrl(CUSTOMER_TICKET_FORM.BLOCKED_BY_MANGOPAY);

  constructor(private customerHelpService: CustomerHelpService) {}
}