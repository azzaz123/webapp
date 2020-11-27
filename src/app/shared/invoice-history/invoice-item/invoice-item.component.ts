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
  public loading = false;

  constructor(
    private invoiceService: InvoiceService,
    private errorsService: ErrorsService
  ) {}

  public handleInvoice(e: Event, invoiceTransaction: InvoiceTransaction): void {
    e.stopPropagation();
    this.loadingState = true;
    if (this.isBillingInfo && this.active) {
      if (invoiceTransaction.invoice_generated) {
        return this.downloadInvoice(invoiceTransaction);
      }

      this.generateInvoice(invoiceTransaction);
    }
  }

  private generateInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService.generateInvoice(invoiceTransaction).subscribe(
      () => {
        invoiceTransaction.invoice_generated = true;
        this.errorsService.i18nSuccess('invoiceGenerated');
        this.loadingState = false;
      },
      (error) => {
        this.loadingState = false;
        this.errorsService.i18nError('invoiceCannotGenerate');
      }
    );
  }

  private downloadInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService.downloadInvoice(invoiceTransaction).subscribe(
      (blob) => {
        this.errorsService.i18nSuccess('invoiceCorrectlyDownloaded');
        const invoiceDate = this.invoiceDateFormatted(
          new Date(invoiceTransaction.date)
        );
        const fileURL = URL.createObjectURL(blob);
        var fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.download = `WallapopInvoice_${invoiceDate}`;
        fileLink.click();
        this.loadingState = false;
      },
      (error) => {
        this.loadingState = false;
        this.errorsService.i18nError('invoiceCannotDownload');
      }
    );
  }

  private invoiceDateFormatted(date: Date): string {
    return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
  }

  private set loadingState(status: boolean) {
    this.loading = status;
  }
}
