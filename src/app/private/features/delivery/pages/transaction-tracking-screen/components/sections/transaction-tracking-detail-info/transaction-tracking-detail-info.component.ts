import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingDetailInfoComponent implements OnInit {
  @Input() transactionTrackingDetails: TransactionTrackingDetails;
  public detailInfoSlots: TransactionDetail[];
  public readonly isBorderBottom = true;

  constructor() {}

  ngOnInit() {
    this.detailInfoSlots = mapTransactionsDetail(this.transactionTrackingDetails.info);
  }
}
