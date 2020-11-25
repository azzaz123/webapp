import { Component, OnInit } from '@angular/core';
import { BillingInfoResponse } from 'app/core/payments/payment.interface';
import { PaymentService } from 'app/core/payments/payment.service';

@Component({
  selector: 'tsl-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  public canDownloadInvoice: boolean;
  public isTabOpened = true;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.getBillingInfo();
  }

  public getBillingInfo(): void {
    this.paymentService.getBillingInfo(true).subscribe(
      (res: BillingInfoResponse) => {
        const isEmpty = Object.values(res).every(
          (atr) => atr === null || atr === ''
        );

        this.isTabOpened = !res || isEmpty;
        this.canDownloadInvoice = true;
      },
      () => {
        this.canDownloadInvoice = false;
      }
    );
  }
}
