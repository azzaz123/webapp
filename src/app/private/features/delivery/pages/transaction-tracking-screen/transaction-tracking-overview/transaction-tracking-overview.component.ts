import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TRANSACTION_TRACKING_INFO } from '@fixtures/private/delivery/transaction-tracking-screen/transaction-tracking-info.fixtures.spec';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTracking$: Observable<TransactionTracking> = of(MOCK_TRANSACTION_TRACKING_INFO);

  constructor() {}

  ngOnInit(): void {}
}
