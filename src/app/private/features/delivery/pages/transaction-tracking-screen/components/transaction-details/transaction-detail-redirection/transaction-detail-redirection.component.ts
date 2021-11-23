import { Component, Input, OnInit } from '@angular/core';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-redirection',
  templateUrl: './transaction-detail-redirection.component.html',
  styleUrls: ['./transaction-detail-redirection.component.scss'],
})
export class TransactionDetailRedirectionComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;

  constructor() {}

  ngOnInit(): void {}
}
