import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TransactionTrackingBanner } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-banner',
  templateUrl: './transaction-tracking-banner.component.html',
  styleUrls: ['./transaction-tracking-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingBannerComponent {
  @Input() banner: TransactionTrackingBanner;
}
