import { Component, Input } from '@angular/core';
import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-action-selector',
  templateUrl: './transaction-tracking-action-selector.component.html',
  styleUrls: ['./transaction-tracking-action-selector.component.scss'],
})
export class TransactionTrackingActionSelectorComponent {
  @Input() actionDetail: TransactionTrackingActionDetail;

  constructor() {}
}
