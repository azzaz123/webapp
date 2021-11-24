import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingBanner } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-banner',
  templateUrl: './transaction-tracking-banner.component.html',
  styleUrls: ['./transaction-tracking-banner.component.scss'],
})
export class TransactionTrackingBannerComponent implements OnInit {
  @Input()
  public banner: TransactionTrackingBanner;

  public titleByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.titleByPass = this.sanitizer.bypassSecurityTrustHtml(this.banner.title);
  }
}
