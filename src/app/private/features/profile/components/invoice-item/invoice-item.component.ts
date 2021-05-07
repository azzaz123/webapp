import { Component, Input } from '@angular/core';
import { ErrorsService } from '@core/errors/errors.service';
import { InvoiceTransaction } from '@core/invoice/invoice.interface';
import { InvoiceService } from '@core/invoice/invoice.service';
import { finalize, take } from 'rxjs/operators';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent {
  @Input() invoice: InvoiceTransaction;
  @Input() active: boolean;
  public loading = false;

  constructor(private invoiceService: InvoiceService, private errorsService: ErrorsService) {}

  public handleInvoice(e: Event, invoiceTransaction: InvoiceTransaction): void {
    e.stopPropagation();
    if (!this.active) {
      return;
    }
    this.loadingState = true;

    if (invoiceTransaction.invoice_generated) {
      this.downloadInvoice(invoiceTransaction);
      return;
    }
    this.generateInvoice(invoiceTransaction);
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
          this.errorsService.i18nSuccess(TRANSLATION_KEY.INVOICE_GENERATED);
        },
        () => {
          this.errorsService.i18nError(TRANSLATION_KEY.INVOICE_CANNOT_GENERATE_ERROR);
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
          this.errorsService.i18nSuccess(TRANSLATION_KEY.INVOICE_DOWNLOADED);
          const invoiceDate = this.invoiceDateFormatted(new Date(invoiceTransaction.date));
          const invoiceDescription = this.invoiceDescriptionformatted(invoiceTransaction.description);
          const fileURL = URL.createObjectURL(blob);
          const fileLink = document.createElement('a');

          fileLink.href = fileURL;
          fileLink.download = `wallapop-${invoiceDescription}-${invoiceDate}.pdf`;
          fileLink.click();
        },
        () => {
          this.errorsService.i18nError(TRANSLATION_KEY.INVOICE_CANNOT_DOWNLOAD_ERROR);
        }
      );
  }

  private invoiceDateFormatted(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  private invoiceDescriptionformatted(description): string {
    return description.replace(/ /g, '-');
  }

  private set loadingState(status: boolean) {
    this.loading = status;
  }
}
