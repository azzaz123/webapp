import { Component, Input } from '@angular/core';
import { TransactionTrackingShippingStatus } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() shippingStatus: TransactionTrackingShippingStatus;
}
