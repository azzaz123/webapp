import { Component, Input } from '@angular/core';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-selector',
  templateUrl: './transaction-detail-selector.component.html',
  styleUrls: ['./transaction-detail-selector.component.scss'],
})
export class TransactionDetailSelectorComponent {
  @Input() transactionDetail: TransactionDetail;
  @Input() isBorderBottom = true;

  constructor() {}
}
