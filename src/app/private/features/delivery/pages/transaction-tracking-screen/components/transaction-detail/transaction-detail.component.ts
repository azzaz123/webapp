import { Component, Input } from '@angular/core';
import { FALLBACK_NOT_FOUND_SRC } from '../../constants/fallback-images-src-constants';
import { TransactionDetail } from '../../interfaces/transaction-detail.interface';
@Component({
  selector: 'tsl-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent {
  @Input() transactionDetail: TransactionDetail;
  @Input() isBorderBottom: boolean;

  public readonly FALLBACK_NOT_FOUND_SRC = FALLBACK_NOT_FOUND_SRC;

  constructor() {}
}
