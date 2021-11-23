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

  constructor(private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  ngOnInit() {}

  public manageAction(actionDetail: TransactionTrackingActionDetail): void {
    this.transactionTrackingActionsService.manageAction(actionDetail);
  }
}
