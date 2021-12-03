import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-status-info-wrapper',
  templateUrl: './transaction-tracking-status-info-wrapper.component.html',
  styleUrls: ['./transaction-tracking-status-info-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingStatusInfoWrapperComponent {
  @Input() transactionTrackingsStatusInfo: TransactionTrackingStatusInfo[];
  @Input() hasBorderBottom: boolean = true;
}
