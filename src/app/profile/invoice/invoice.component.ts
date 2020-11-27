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
  public activeIds: string[] = ['custom-panel-1'];
  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.getBillingInfo();
  }

  public getBillingInfo(): void {
    this.paymentService.getBillingInfo(false).subscribe(
      (res: BillingInfoResponse) => {
        this.isBilling = res && !!res.cif && !!res.id;
        this.handleModal(this.isBilling);
        this.canDownloadInvoice = true;
      },
      (error) => {
        this.canDownloadInvoice = false;
      }
    );
  }

  private handleModal(formIsFull = false): void {
    if (formIsFull) {
      this.activeIds = [];
    } else {
      this.activeIds = ['custom-panel-1'];
    }
  }
}
