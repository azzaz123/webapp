import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { Invoice } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent implements OnInit {

  @Input() active: boolean;
  public invoices: Invoice[];
  public limit = 5;
  public total: number;
  
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.getInvoices();
  }

  private getInvoices(): void {
    this.invoiceService.getInvoices().subscribe((invoices) => {
      this.invoices = invoices;
      this.total = this.invoices.length;
    })
  }

  public loadMore(): void {
    this.limit = this.limit + 5;
  }

  public showLoadMore(): boolean {
    return this.invoices && this.invoices.length > 10 && this.limit <= this.total;
  }

  get sortedInvoices() {
    return this.invoices && this.invoices.sort((a, b) => {
      return <any>new Date(b.transaction_date) - <any>new Date(a.transaction_date);
    });
  }
}