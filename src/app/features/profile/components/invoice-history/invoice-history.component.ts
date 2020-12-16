import { Component, Input, OnInit } from '@angular/core';
import { InvoiceTransaction } from '@core/invoice/invoice.interface';
import { InvoiceService } from '@core/invoice/invoice.service';
import { finalize } from 'rxjs/operators';

export enum InvoiceRequestStatus {
  EMPTY_HISTORY = 'EmptyHistory',
  NOT_OLD_INVOICES = 'NotOldInvoices',
}

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
    this.invoiceService
      .getInvoiceTransactions()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (invoiceTransactions: InvoiceTransaction[]) => {
          invoiceTransactions.forEach(
            (transaction) =>
              (transaction.currencySymbol = this.currencies[
                transaction.currency
              ])
          );
          this.invoiceTransactions = invoiceTransactions;
          this.total = invoiceTransactions.length;
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

  get sortedInvoices(): InvoiceTransaction[] {
    return (
      this.invoiceTransactions &&
      this.invoiceTransactions.sort((a, b) => {
        return b.date - a.date;
      })
    );
  }

  protected isShown(keyMessage: InvoiceRequestStatus): boolean {
    const conditions =
      (!Array.isArray(this.invoiceTransactions) ||
        !this.invoiceTransactions.length) &&
      !this.isErrorLoading &&
      !this.loading;

    switch (keyMessage) {
      case InvoiceRequestStatus.EMPTY_HISTORY:
        return this.active && conditions;
      case InvoiceRequestStatus.NOT_OLD_INVOICES:
        return !this.active && conditions;
    }
  }
}
