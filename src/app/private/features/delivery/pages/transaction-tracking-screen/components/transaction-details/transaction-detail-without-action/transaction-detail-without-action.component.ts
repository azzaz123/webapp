import { Component, Input } from '@angular/core';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-without-action',
  templateUrl: './transaction-detail-without-action.component.html',
  styleUrls: ['./transaction-detail-without-action.component.scss'],
})
export class TransactionDetailWithoutActionComponent {
  @Input() transactionDetail: TransactionDetail;
  @Input() hasBorderBottom: boolean;

  constructor() {}
}
