import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CUSTOMER_TICKET_FORM } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { KYCModalProperties } from '../../interfaces/kyc-modal-properties.interface';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCStatusComponent {
  @Input() properties: KYCModalProperties;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  public ZENDESK_HELP_FORM_URL: string = this.customerHelpService.getFormPageUrl(CUSTOMER_TICKET_FORM.MANGOPAY_HELP);

  constructor(private customerHelpService: CustomerHelpService) {}

  get message(): string {
    return this.properties.description || this.properties.refusedMessage;
  }
}
