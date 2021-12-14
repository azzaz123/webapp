import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { ActivatedRoute } from '@angular/router';
import { TransactionTrackingScreenTrackingEventsService } from '../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { tap } from 'rxjs/operators';

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
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
    this.transactionTracking$ = this.transactionTrackingService.get(requestId).pipe(
      tap((transactionTracking: TransactionTracking) => {
        this.transactionTrackingScreenTrackingEventsService.trackViewTTSScreen(
          requestId,
          transactionTracking.analytics.buyer.country,
          transactionTracking.analytics.seller.country
        );
      })
    );

    this.transactionTrackingDetails$ = this.transactionTrackingService.getDetails(requestId);
  }
}
