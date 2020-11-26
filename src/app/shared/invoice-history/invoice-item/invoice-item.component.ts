import { Component, Input } from '@angular/core';
import { ErrorsService } from 'app/core/errors/errors.service';
import {
  Invoice,
  InvoiceTransaction,
} from 'app/core/invoice/invoice.interface';
import { InvoiceService } from 'app/core/invoice/invoice.service';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent {
  @Input() invoice: InvoiceTransaction;
  @Input() active: boolean;
  @Input() isBillingInfo: boolean;

  constructor(
    private invoiceService: InvoiceService,
    private errorsService: ErrorsService
  ) {}

  public handleInvoice(e: Event, invoiceTransaction: InvoiceTransaction): void {
    e.stopPropagation();
    if (this.isBillingInfo && this.active) {
      if (invoiceTransaction.invoice_generated) {
        return this.downloadInvoice(invoiceTransaction);
      }

      this.generateInvoice(invoiceTransaction);
    }
  }

  private generateInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService.generateInvoice(invoiceTransaction).subscribe(
      (newInvoice: any) => {
        this.updateInvoice(invoiceTransaction, newInvoice);
        this.errorsService.i18nSuccess('invoiceGenerated');
      },
      (error) => {
        this.errorsService.i18nError('invoiceCannotGenerate');
      }
    );
  }

  private downloadInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService.downloadInvoice(invoiceTransaction).subscribe(
      (pdfFile) => {
        this.errorsService.i18nSuccess('invoiceCorrectlyDownloaded');
      },
      (error) => {
        this.errorsService.i18nError('invoiceCannotDownload');
      }
    );
  }

  private updateInvoice(
    oldInvoice: InvoiceTransaction,
    newInvoice: InvoiceTransaction
  ): void {
    oldInvoice = newInvoice;
  }
}
