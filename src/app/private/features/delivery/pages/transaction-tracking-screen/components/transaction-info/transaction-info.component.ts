import { Component, Input, OnInit } from '@angular/core';
import { TransactionInfo } from '../../interfaces/transaction-info.interface';

@Component({
  selector: 'tsl-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent implements OnInit {
  @Input() transactionInfo: TransactionInfo;

  constructor() {}

  ngOnInit(): void {}
}
