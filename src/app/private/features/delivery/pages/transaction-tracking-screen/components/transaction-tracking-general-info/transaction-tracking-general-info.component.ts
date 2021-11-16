import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingActionDetail, TransactionTrackingShippingStatus } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() shippingStatus: TransactionTrackingShippingStatus;
  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.shippingStatus.description);
  }

  public manageAction(actionDetail: TransactionTrackingActionDetail): void {
    this.transactionTrackingActionsService.manageAction(actionDetail);
  }
}
