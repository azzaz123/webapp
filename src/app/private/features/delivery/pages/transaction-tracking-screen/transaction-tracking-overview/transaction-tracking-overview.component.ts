import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MOCK_TRANSACTION_TRACKING } from '@fixtures/private/delivery/TTS/transaction-tracking.fixtures.spec';
import { TransactionTrackingHeader } from '../interfaces/transaction-tracking-header.interface';
import { map } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTrackingInfo$: Observable<any> = of(MOCK_TRANSACTION_TRACKING);
  public transactionTrackingHeaderProperties$: Observable<TransactionTrackingHeader>;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.transactionTrackingHeaderProperties$ = this.initializeHeaderProperties();
  }

  public goBack(): void {
    this.location.back();
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
