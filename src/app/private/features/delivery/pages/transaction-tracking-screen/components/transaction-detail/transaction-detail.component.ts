import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FALLBACK_NOT_FOUND_SRC } from '../../constants/fallback-images-src-constants';
import { TransactionDetail } from '../../interfaces/transaction-detail.interface';
@Component({
  selector: 'tsl-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  @Input() transactionDetail: TransactionDetail;
  @Input() isClickableAction: boolean;
  @Input() isBorderBottom: boolean;
  @Output() caretClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() actionClick: EventEmitter<void> = new EventEmitter<void>();

  public readonly FALLBACK_NOT_FOUND_SRC = FALLBACK_NOT_FOUND_SRC;
  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.transactionDetail.description);
  }

  public emitActionClick(): void {
    if (this.isClickableAction) {
      this.actionClick.emit();
    }
  }
}
