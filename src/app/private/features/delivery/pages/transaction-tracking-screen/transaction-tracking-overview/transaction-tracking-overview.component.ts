import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { ActivatedRoute } from '@angular/router';
import { TransactionTrackingScreenTrackingEventsService } from '../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

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
    this.transactionTracking$ = this.transactionTrackingService.get(requestId);
    this.transactionTrackingDetails$ = this.transactionTrackingService.getDetails(requestId);

    this.transactionTrackingScreenTrackingEventsService.trackViewTTSScreen(requestId);
  }
}
