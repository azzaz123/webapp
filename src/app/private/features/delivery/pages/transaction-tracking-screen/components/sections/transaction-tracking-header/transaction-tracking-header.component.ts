import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransactionTrackingHeader } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-header',
  templateUrl: './transaction-tracking-header.component.html',
  styleUrls: ['./transaction-tracking-header.component.scss'],
})
export class TransactionTrackingHeaderComponent {
  @Input() transactionTrackingHeader: TransactionTrackingHeader;

  constructor(private location: Location) {}

  public goBack(): void {
    this.location.back();
  }
}
