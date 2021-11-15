import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingInfo } from '../../interfaces/transaction-tracking-info.interface';

@Component({
  selector: 'tsl-transaction-tracking-detail-info',
  templateUrl: './transaction-tracking-detail-info.component.html',
  styleUrls: ['./transaction-tracking-detail-info.component.scss'],
})
export class TransactionTrackingDetailInfoComponent implements OnInit {
  @Input() transactionTrackingInfo: TransactionTrackingInfo;
  @Input() isClickableAction: boolean;
  @Input() isBorderBottom: boolean;
  @Output() caretClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() actionClick: EventEmitter<void> = new EventEmitter<void>();

  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.transactionTrackingInfo.description);
  }
}
