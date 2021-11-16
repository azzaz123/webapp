import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTrackingInfo$: Observable<TransactionTracking> = of(MOCK_TRANSACTION_TRACKING);

  constructor() {}

  ngOnInit(): void {}
}
