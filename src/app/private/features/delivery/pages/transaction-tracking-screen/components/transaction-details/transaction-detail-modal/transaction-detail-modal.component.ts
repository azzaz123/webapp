import { Component, Input, OnInit } from '@angular/core';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';

@Component({
  selector: 'tsl-transaction-detail-modal',
  templateUrl: './transaction-detail-modal.component.html',
  styleUrls: ['./transaction-detail-modal.component.scss'],
})
export class TransactionDetailModalComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;

  constructor() {}

  ngOnInit(): void {}

  public openModal() {}
}
