import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() srcImage: string;
  @Input() defaultSrcSvg: string;
  @Input() showCaret: boolean;
  @Input() isRoundedImage: boolean;
  @Input() isRoundedBorderImage: boolean;
}
