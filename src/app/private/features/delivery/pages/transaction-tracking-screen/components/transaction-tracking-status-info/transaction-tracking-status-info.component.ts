import { Component, Input } from '@angular/core';
import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { FALLBACK_NOT_FOUND_SRC } from '../../constants/fallback-images-src-constants';
@Component({
  selector: 'tsl-transaction-tracking-status-info',
  templateUrl: './transaction-tracking-status-info.component.html',
  styleUrls: ['./transaction-tracking-status-info.component.scss'],
})
export class TransactionTrackingStatusInfoComponent {
  @Input() transactionTrackingStatusInfo: TransactionTrackingStatusInfo;
  @Input() hasBorderBottom: boolean;

  public readonly FALLBACK_NOT_FOUND_SRC = FALLBACK_NOT_FOUND_SRC;
}
