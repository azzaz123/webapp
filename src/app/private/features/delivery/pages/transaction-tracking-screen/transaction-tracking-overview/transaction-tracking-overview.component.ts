import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TRANSACTION_TRACKING_INFO } from '@fixtures/private/delivery/transaction-tracking-screen/transaction-tracking-info.fixtures.spec';
import { TransactionTrackingHeader } from '../interfaces/transaction-tracking-header.interface';
import { map } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTrackingInfo$: Observable<any> = of(MOCK_TRANSACTION_TRACKING_INFO);
  public transactionTrackingHeaderProperties$: Observable<TransactionTrackingHeader>;

  constructor() {}

  ngOnInit(): void {
    this.transactionTrackingHeaderProperties$ = this.initializeHeaderProperties();
  }

  public initializeHeaderProperties(): Observable<TransactionTrackingHeader> {
    return this.transactionTrackingInfo$.pipe(
      map((transactionTrackingInfo: any) => {
        return {
          title: transactionTrackingInfo.title,
          header: transactionTrackingInfo.header,
        };
      })
    );
  }
}
