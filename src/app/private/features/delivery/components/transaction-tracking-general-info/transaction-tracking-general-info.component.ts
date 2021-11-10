import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionTrackingGeneralInfo } from '../../interfaces/TTS/transaction-tracking-general-info.interface';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() transactionTrackingGeneralInfo: TransactionTrackingGeneralInfo;
  // this will be an action
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  constructor() {}
}
