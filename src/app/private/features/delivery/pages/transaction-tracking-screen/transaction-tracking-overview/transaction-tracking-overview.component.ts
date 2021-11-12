import { Component, OnInit } from '@angular/core';
import { MOCK_TRANSACTION_TRACKING_INFO } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-info.fixtures.spec';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTracking$: Observable<any> = of(MOCK_TRANSACTION_TRACKING_INFO);

  constructor() {}

  ngOnInit(): void {}
}
