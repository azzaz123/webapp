import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CUSTOMER_TICKET_FORM } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { KYC_MODAL_STATUS } from '../../enums/kyc-modal-status.enum';
import { KYCModalProperties } from '../../interfaces/kyc-modal-properties.interface';
import { KYCTrackingEventsService } from '../../services/kyc-tracking-events/kyc-tracking-events.service';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
})
export class KYCStatusComponent implements OnInit {
  @Input() properties: KYCModalProperties;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public HELP_FORM_URL: string = this.customerHelpService.getFormPageUrl(CUSTOMER_TICKET_FORM.BLOCKED_BY_MANGOPAY);

  constructor(private customerHelpService: CustomerHelpService, private kycTrackingEventsService: KYCTrackingEventsService) {}

  ngOnInit() {
    if (this.properties?.status === KYC_MODAL_STATUS.IN_PROGRESS) {
      this.kycTrackingEventsService.trackViewKYCVerifyingIdentityScreen();
    }
  }
}
