import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public transactionTracking$: Observable<TransactionTracking>;

  constructor(private route: ActivatedRoute, private transactionTrackingService: TransactionTrackingService) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
    this.transactionTracking$ = this.transactionTrackingService.get(transactionId);
  }
}
