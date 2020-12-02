import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { InvoiceTransaction } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent implements OnInit {
  private currencies = {
    EUR: '€',
    GBP: '£',
  };
  @Input() active: boolean;
  public loading = false;
  public invoiceTransactions: InvoiceTransaction[];
  public limit = 5;
  public total: number;
  public isErrorLoading = false;
  private LOAD_MORE_QUANTITY = 5;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.getInvoiceTransactions();
  }

  private getInvoiceTransactions(): void {
    this.loading = true;
    this.invoiceService.getInvoiceTransactions().subscribe(
      (invoiceTransactions: InvoiceTransaction[]) => {
        invoiceTransactions.forEach(
          (transaction) =>
            (transaction.currencySymbol = this.currencies[transaction.currency])
        );
        this.invoiceTransactions = invoiceTransactions;
        this.total =
          invoiceTransactions && invoiceTransactions.length
            ? this.invoiceTransactions.length
            : 0;
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
      this.invoiceTransactions &&
      this.invoiceTransactions.length > this.LOAD_MORE_QUANTITY &&
      this.limit <= this.total
    );
  }

  get sortedInvoices() {
    return (
      this.invoiceTransactions &&
      this.invoiceTransactions.sort((a, b) => {
        return b.date - a.date;
      })
    );
  }

  protected isShowed(keyMessage: string): boolean {
    const conditions =
      (!Array.isArray(this.invoiceTransactions) ||
        !this.invoiceTransactions.length) &&
      !this.isErrorLoading &&
      !this.loading;

    switch (keyMessage) {
      case 'EmptyHistory':
        return this.active && conditions;
      case 'NotOldInvoices':
        return !this.active && conditions;
    }
  }
}
