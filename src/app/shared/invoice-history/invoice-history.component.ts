import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { Invoice } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent implements OnInit {

  public invoices: Invoice[];
  
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.getInvoices();
  }

  private getInvoices(): void {
    this.invoiceService.getInvoices().subscribe((invoices) => {
      this.invoices = invoices;
    })
  }
}