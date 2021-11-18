import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { DeviceService } from '@core/device/device.service';
import { TransactionDetail } from '../../../interfaces/transaction-detail.interface';
import { TransactionInfo } from '../../../interfaces/transaction-info.interface';
import { mapTransactionTrackingDetailsToInfo } from '../../../mappers/transaction-info.mapper';
import { mapTransactionsDetail } from '../../../mappers/transaction-detail.mapper';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingDetailInfoComponent {
  @Input() transactionTrackingDetails: TransactionTrackingDetails;

  constructor(private deviceService: DeviceService) {}

  public get transactionInfo(): TransactionInfo {
    return mapTransactionTrackingDetailsToInfo(this.transactionTrackingDetails);
  }

  public get transactionDetails(): TransactionDetail[] {
    return mapTransactionsDetail(this.transactionTrackingDetails.info);
  }

  public get isMobile(): boolean {
    return this.deviceService.isMobile();
  }
}
