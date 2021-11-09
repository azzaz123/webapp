import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionTrackingDetailInfoComponent {
  constructor(public sanitizer: DomSanitizer) {}
  @Input() description: string;
  @Input() iconSrc: string;
  @Input() showCaret: boolean;
  @Input() isRoundedIcon: boolean;
}
