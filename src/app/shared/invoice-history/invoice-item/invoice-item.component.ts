import { Component, Input } from '@angular/core';
import { ErrorsService } from 'app/core/errors/errors.service';
import { InvoiceTransaction } from 'app/core/invoice/invoice.interface';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent {
  @Input() invoice: InvoiceTransaction;
  @Input() active: boolean;
  public loading = false;

  constructor(
    private invoiceService: InvoiceService,
    private errorsService: ErrorsService
  ) {}

  public handleInvoice(e: Event, invoiceTransaction: InvoiceTransaction): void {
    e.stopPropagation();
    this.loadingState = true;
    if (this.active && invoiceTransaction.invoice_generated) {
      this.downloadInvoice(invoiceTransaction);
    } else if (this.active && !invoiceTransaction.invoice_generated) {
      this.generateInvoice(invoiceTransaction);
    }
  }

  private generateInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService
      .generateInvoice(invoiceTransaction)
      .pipe(
        take(1),
        finalize(() => {
          this.loadingState = false;
        })
      )
      .subscribe(
        () => {
          invoiceTransaction.invoice_generated = true;
          this.errorsService.i18nSuccess('invoiceGenerated');
        },
        (error) => {
          this.errorsService.i18nError('invoiceCannotGenerate');
        }
      );
  }

  private downloadInvoice(invoiceTransaction: InvoiceTransaction): void {
    this.invoiceService
      .downloadInvoice(invoiceTransaction)
      .pipe(
        take(1),
        finalize(() => {
          this.loadingState = false;
        })
      )
      .subscribe(
        (blob: Blob) => {
          this.errorsService.i18nSuccess('invoiceCorrectlyDownloaded');
          const invoiceDate = this.invoiceDateFormatted(
            new Date(invoiceTransaction.date)
          );
          const fileURL = URL.createObjectURL(blob);
          const fileLink = document.createElement('a');

          fileLink.href = fileURL;
          fileLink.download = `WallapopInvoice_${invoiceDate}`;
          fileLink.click();
        },
        (error) => {
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
