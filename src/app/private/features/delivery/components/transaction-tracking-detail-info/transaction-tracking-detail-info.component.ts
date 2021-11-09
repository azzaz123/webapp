import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingInfo } from '../../interfaces/tts/transaction-tracking-info.interface';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent implements OnInit {
  @Input() transactionTrackingInfo: TransactionTrackingInfo;

  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.transactionTrackingInfo.description);
  }
}
