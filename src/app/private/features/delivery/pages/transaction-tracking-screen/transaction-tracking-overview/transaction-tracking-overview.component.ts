import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MOCK_TRANSACTION_TRACKING } from '@fixtures/private/delivery/TTS/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public trackingInfo$: Observable<any> = of(MOCK_TRANSACTION_TRACKING);

  constructor(private location: Location, private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  ngOnInit(): void {}

  public goBack(): void {
    this.location.back();
  }

  public manageAction(action: any): void {
    this.transactionTrackingActionsService.manageAction(action);
  }
}
