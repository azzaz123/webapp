import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { TransactionTrackingScreenStoreService } from '../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';

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
    private storeService: TransactionTrackingScreenStoreService,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService,
    private errorActionService: SharedErrorActionService
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
    this.initializeTransactionTracking(requestId);
    this.initializeTransactionTrackingDetails(requestId);

    this.transactionTracking$ = this.storeService.transactionTracking$;
    this.transactionTrackingDetails$ = this.storeService.transactionTrackingDetails$;
  }

  private initializeTransactionTracking(requestId: string): void {
    this.transactionTrackingService
      .get(requestId)
      .pipe(
        tap((transactionTracking: TransactionTracking) => {
          this.trackViewPageEvent(requestId, transactionTracking);
          this.storeService.transactionTracking = transactionTracking;
        }),
        catchError((error: unknown) => {
          this.errorActionService.show(error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  private initializeTransactionTrackingDetails(requestId: string): void {
    this.transactionTrackingService
      .getDetails(requestId)
      .pipe(
        tap((details: TransactionTrackingDetails) => {
          this.storeService.transactionTrackingDetails = details;
        }),
        catchError((error: unknown) => {
          this.errorActionService.show(error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  private trackViewPageEvent(requestId: string, transactionTracking: TransactionTracking): void {
    this.transactionTrackingScreenTrackingEventsService.trackViewTTSScreen(
      requestId,
      transactionTracking.analytics.buyer.country,
      transactionTracking.analytics.seller.country
    );
  }
}
