import { Component, Input } from '@angular/core';
import { TransactionInfo } from '../../interfaces/transaction-info.interface';

@Component({
  selector: 'tsl-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent {
  @Input() transactionInfo: TransactionInfo;

  constructor() {}
}
