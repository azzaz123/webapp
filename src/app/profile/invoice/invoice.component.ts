import { Component, OnDestroy, OnInit } from '@angular/core';
import { BillingInfoResponse } from 'app/core/payments/payment.interface';
import { PaymentService } from 'app/core/payments/payment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public canDownloadInvoice: boolean;
  public activeIds: string[] = ['custom-panel-1'];
  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.getBillingInfo();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((x) => x.unsubscribe);
  }

  public getBillingInfo(): void {
    this.subscriptions.push(
      this.paymentService.getBillingInfo(false).subscribe(
        (res: BillingInfoResponse) => {
          this.canDownloadInvoice = !!res && !!res.cif && !!res.id;
          this.handleModal = this.canDownloadInvoice;
        },
        (error) => {
          this.canDownloadInvoice = false;
        }
      )
    );
  }

  set handleModal(formIsFull) {
    this.activeIds = formIsFull ? [] : ['custom-panel-1'];
  }
}
