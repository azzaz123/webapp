import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TransactionTrackingActionDetail, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingDetailInfoComponent implements OnInit {
  @Input() transactionTrackingDetails: TransactionTrackingDetails;
  public detailInfoSlots: TransactionDetail[];
  public readonly isBorderBottom = true;

  constructor(private transactionTrackingActionsService: TransactionTrackingActionsService) {}

  ngOnInit() {
    this.detailInfoSlots = mapTransactionsDetail(this.transactionTrackingDetails.info);
  }

  public manageAction(action: TransactionTrackingActionDetail): void {
    this.transactionTrackingActionsService.manageAction(action);
  }
}
