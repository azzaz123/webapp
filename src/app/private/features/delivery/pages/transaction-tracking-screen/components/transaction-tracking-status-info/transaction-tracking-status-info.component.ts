import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingActionDetail, TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { TransactionTrackingInfo } from '../../interfaces/transaction-tracking-info.interface';
import { mapTransactionsTrackingInfo } from '../../mappers/transaction-tracking-info.mapper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-status-info',
  templateUrl: './transaction-tracking-status-info.component.html',
  styleUrls: ['./transaction-tracking-status-info.component.scss'],
})
export class TransactionTrackingStatusInfoComponent {
  @Input() transactionTrackingStatusInfo: TransactionTrackingStatusInfo[];

  constructor(private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  public manageSlotAction(action: TransactionTrackingActionDetail): void {
    this.transactionTrackingActionsService.manageAction(action);
  }

  public get detailInfoSlots(): TransactionTrackingInfo[] {
    return mapTransactionsTrackingInfo(this.transactionTrackingStatusInfo);
  }
}
