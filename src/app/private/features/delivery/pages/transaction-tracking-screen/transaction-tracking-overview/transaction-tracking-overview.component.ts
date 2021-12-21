import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTracking$: Observable<TransactionTracking>;
  public transactionTrackingDetails$: Observable<TransactionTrackingDetails>;

  constructor(
    private route: ActivatedRoute,
    private transactionTrackingService: TransactionTrackingService,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService,
    private errorActionService: SharedErrorActionService
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);

    this.transactionTracking$ = this.getTransactionTracking(requestId);
    this.transactionTrackingDetails$ = this.getTransactionTrackingDetails(requestId);
  }

  private getTransactionTracking(requestId: string): Observable<TransactionTracking | never> {
    return this.transactionTrackingService.get(requestId).pipe(
      tap((transactionTracking: TransactionTracking) => {
        this.transactionTrackingScreenTrackingEventsService.trackViewTTSScreen(
          requestId,
          transactionTracking.analytics.buyer.country,
          transactionTracking.analytics.seller.country
        );
      }),
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }

  private getTransactionTrackingDetails(requestId: string): Observable<TransactionTrackingDetails | never> {
    return this.transactionTrackingService.getDetails(requestId).pipe(
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}
