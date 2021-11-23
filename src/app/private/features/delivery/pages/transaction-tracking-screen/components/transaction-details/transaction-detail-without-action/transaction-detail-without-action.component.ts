import { Component, Input, OnInit } from '@angular/core';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-without-action',
  templateUrl: './transaction-detail-without-action.component.html',
  styleUrls: ['./transaction-detail-without-action.component.scss'],
})
export class TransactionDetailWithoutActionComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;
  @Input() isBorderBottom: boolean;

  constructor() {}

  ngOnInit() {}
}
