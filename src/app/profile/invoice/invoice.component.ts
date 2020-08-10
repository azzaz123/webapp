import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'app/core/payments/payment.service';

@Component({
  selector: 'tsl-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {

  public canDownloadInvoice: boolean;

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.getBillingInfo();
  }

  public getBillingInfo(): void {
    this.paymentService.getBillingInfo(true).subscribe(() => {
      this.canDownloadInvoice = true;
    }, () => {
      this.canDownloadInvoice = false;
    });
  }
}