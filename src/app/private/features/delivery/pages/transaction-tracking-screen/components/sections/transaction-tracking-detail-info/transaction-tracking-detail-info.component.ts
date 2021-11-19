import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingDetailInfoComponent {
  @Input() transactionTrackingDetails: TransactionTrackingDetails;

  constructor() {}

  public get transactionDetails(): TransactionDetail[] {
    return mapTransactionsDetail(this.transactionTrackingDetails.info);
  }
}
