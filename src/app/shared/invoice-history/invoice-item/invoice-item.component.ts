import { Component, Input } from '@angular/core';
import { Invoice } from 'app/core/invoice/invoice.interface';
import { InvoiceService } from 'app/core/invoice/invoice.service';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent {
  
  @Input() invoice: Invoice;
  @Input() active: boolean;

  constructor(private invoiceService: InvoiceService) {}

  // TODO: call endpoint to download PDF (to be decided with backend)
  public downloadInvoice(e: Event, invoice: Invoice) {
    e.stopPropagation();
    if (invoice.available && this.active) {
      this.invoiceService.downloadInvoice(invoice).subscribe((pdfFile) => {
        console.log('PDF File: ', pdfFile);
      });
    }
    
  }
}