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
  public isBilling = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.getBillingInfo();
  }

  public getBillingInfo(): void {
    this.paymentService.getBillingInfo(false).subscribe(
      (res: BillingInfoResponse) => {
        this.isBilling = res && !!res.cif && !!res.id;
        this.canDownloadInvoice = true;
      },
      (error) => {
        this.canDownloadInvoice = false;
      }
    );
  }
}
