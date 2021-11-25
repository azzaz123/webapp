import { Component, Input } from '@angular/core';
import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent {
  @Input() transactionTrackingsStatusInfo: TransactionTrackingStatusInfo[];

  constructor() {}
}
