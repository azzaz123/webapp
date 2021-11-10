import { Component, Input } from '@angular/core';
import { TransactionTrackingGeneralInfo } from '../../interfaces/TTS/transaction-tracking-general-info.interface';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() transactionTrackingGeneralInfo: TransactionTrackingGeneralInfo;

  constructor() {}
}
