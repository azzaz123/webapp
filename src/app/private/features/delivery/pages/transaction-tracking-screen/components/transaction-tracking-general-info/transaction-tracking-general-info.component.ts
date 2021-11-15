import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingGeneralInfo } from '../../../../interfaces/TTS/transaction-tracking-general-info.interface';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() transactionTrackingGeneralInfo: TransactionTrackingGeneralInfo;
  // this will be an action
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();
  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.transactionTrackingGeneralInfo.description);
  }
}
