import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingActionDetail, TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-status-info',
  templateUrl: './transaction-tracking-status-info.component.html',
  styleUrls: ['./transaction-tracking-status-info.component.scss'],
})
export class TransactionTrackingStatusInfoComponent {
  @Input() transactionTrackingStatusInfo: TransactionTrackingStatusInfo[];
  public detailInfoSlots: TransactionDetail[];

  constructor(private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  ngOnInit() {
    this.detailInfoSlots = mapTransactionsDetail(this.transactionTrackingStatusInfo);
  }

  public manageSlotAction(action: TransactionTrackingActionDetail): void {
    this.transactionTrackingActionsService.manageAction(action);
  }
}
