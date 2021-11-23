import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-status-info',
  templateUrl: './transaction-tracking-status-info.component.html',
  styleUrls: ['./transaction-tracking-status-info.component.scss'],
})
export class TransactionTrackingStatusInfoComponent {
  @Input() transactionTrackingStatusInfo: TransactionTrackingStatusInfo[];
  public detailInfoSlots: TransactionDetail[];

  constructor() {}

  ngOnInit() {
    this.detailInfoSlots = mapTransactionsDetail(this.transactionTrackingStatusInfo);
  }
}
