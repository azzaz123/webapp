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
  @Input() isBillingInfo: boolean;
  public loading = false;
  public invoices: Invoice[];
  public limit = 5;
  public total: number;
  public isErrorLoading = false;
  private LOAD_MORE_QUANTITY = 5;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.getInvoice();
  }

  private getInvoice(): void {
    this.loading = true;
    this.invoiceService.getInvoices().subscribe(
      (invoices) => {
        this.invoices = invoices;
        this.total = invoices && invoices.length ? this.invoices.length : 0;
        this.loading = false;
      },
      (error) => {
        this.isErrorLoading = true;
      }
    );
  }

  public loadMore(): void {
    this.limit = this.limit + this.LOAD_MORE_QUANTITY;
  }

  public showLoadMore(): boolean {
    return (
      this.invoices &&
      this.invoices.length > this.LOAD_MORE_QUANTITY &&
      this.limit <= this.total
    );
  }

  get sortedInvoices() {
    return (
      this.invoices &&
      this.invoices.sort((a, b) => {
        return (
          <any>new Date(b.transaction_date) - <any>new Date(a.transaction_date)
        );
      })
    );
  }

  isShowed(keyMessage: string): boolean {
    switch (keyMessage) {
      case 'EmptyHistory':
        return (
          (!this.invoices || (this.invoices && !this.invoices.length)) &&
          this.isBillingInfo &&
          !this.isErrorLoading
        );
      case 'NotOldInvoices':
        return (
          (!this.invoices || (this.invoices && !this.invoices.length)) &&
          !this.isBillingInfo &&
          !this.isErrorLoading
        );
    }
  }
}
