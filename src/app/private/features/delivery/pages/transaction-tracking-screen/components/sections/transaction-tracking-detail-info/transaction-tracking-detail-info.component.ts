import { Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent implements OnInit {
  @Input() transactionTrackingDetails: TransactionTrackingDetails;

  constructor() {}

  ngOnInit(): void {}
}
