import { Component, Input } from '@angular/core';
import { FALLBACK_ITEM_SRC, FALLBACK_USER_SRC } from '../../constants/fallback-images-src-constants';
import { TransactionInfo } from '../../interfaces/transaction-info.interface';

@Component({
  selector: 'tsl-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent {
  @Input() transactionInfo: TransactionInfo;

  public readonly FALLBACK_ITEM_SRC = FALLBACK_ITEM_SRC;
  public readonly FALLBACK_USER_SRC = FALLBACK_USER_SRC;
}
