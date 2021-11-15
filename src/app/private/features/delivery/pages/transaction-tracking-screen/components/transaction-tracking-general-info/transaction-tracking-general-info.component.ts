import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TransactionTrackingAction, TransactionTrackingShippingStatus } from '@api/core/model/delivery/transaction/tracking';

@Component({
  selector: 'tsl-transaction-tracking-general-info',
  templateUrl: './transaction-tracking-general-info.component.html',
  styleUrls: ['./transaction-tracking-general-info.component.scss'],
})
export class TransactionTrackingGeneralInfoComponent {
  @Input() shippingStatus: TransactionTrackingShippingStatus;
  public descriptionByPass: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.descriptionByPass = this.sanitizer.bypassSecurityTrustHtml(this.shippingStatus.description);
  }

  public manageAction(action: TransactionTrackingAction): void {}
}
