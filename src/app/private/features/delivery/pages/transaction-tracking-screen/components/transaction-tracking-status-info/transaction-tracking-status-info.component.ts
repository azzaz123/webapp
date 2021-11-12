import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionTrackingInfo } from '@private/features/delivery/interfaces/tts/transaction-tracking-info.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tsl-transaction-tracking-status-info',
  templateUrl: './transaction-tracking-status-info.component.html',
  styleUrls: ['./transaction-tracking-status-info.component.scss'],
})
export class TransactionTrackingStatusInfoComponent {
  @Input() transactionTrackingStatusInfo;

  public get detailInfoSlots(): TransactionTrackingInfo[] {
    const propertiesMapped: TransactionTrackingInfo[] = [];
    this.transactionTrackingStatusInfo.forEach((slot: any) => {
      propertiesMapped.push({
        description: slot.description,
        iconSrc: slot.icon.url,
        showCaret: slot.showCaret,
        iconClassName: slot.icon.style.className,
      });
    });
    return propertiesMapped;
  }
}
