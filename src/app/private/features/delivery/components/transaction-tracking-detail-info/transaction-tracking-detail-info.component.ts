import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent {
  @Input() description: string;
  @Input() iconSrc: string;
  @Input() showCaret: boolean;
  @Input() isRoundedIcon: boolean;
  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.description);
  }
}
