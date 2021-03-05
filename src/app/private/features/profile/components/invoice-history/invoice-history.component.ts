import { Component, Input, OnInit } from '@angular/core';
import { InvoiceTransaction } from '@core/invoice/invoice.interface';
import { InvoiceService } from '@core/invoice/invoice.service';
import { finalize } from 'rxjs/operators';

export enum InvoiceRequestStatus {
  EMPTY_HISTORY = 'EmptyHistory',
  NOT_OLD_INVOICES = 'NotOldInvoices',
}

export enum TRANSACTIONS_FILTERS {
  ALL = 'all',
  INVOICES = 'invoices',
  CREDIT = 'credit',
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
  public filteredTransactions: InvoiceTransaction[];
  public isErrorLoading = false;
  public filterInvoices = TRANSACTIONS_FILTERS;
  public selectedFilter = TRANSACTIONS_FILTERS.ALL;
  public invoiceRequestStatus = InvoiceRequestStatus;
  private LOAD_MORE_QUANTITY = 5;
  private START_LIMIT = 5;

  constructor(private invoiceService: InvoiceService) {}

  filterConfig = {
    [this.filterInvoices.ALL]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions),
      limit: this.START_LIMIT,
    },
    [this.filterInvoices.INVOICES]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions.filter((invoice) => invoice.price >= 0)),
      limit: this.START_LIMIT,
    },
    [this.filterInvoices.CREDIT]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions.filter((invoice) => invoice.price < 0)),
      limit: this.START_LIMIT,
    },
  };

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
          invoiceTransactions.forEach((transaction) => (transaction.currencySymbol = this.currencies[transaction.currency]));
          this.invoiceTransactions =
            invoiceTransactions &&
            invoiceTransactions.sort((a, b) => {
              return b.date - a.date;
            });
          this.onChangeFilter(TRANSACTIONS_FILTERS.ALL);
        },
        () => {
          this.isErrorLoading = true;
        }
      );
  }

  public loadMore(): void {
    this.filterConfig[this.selectedFilter].limit += this.LOAD_MORE_QUANTITY;
  }

  public showLoadMore(): boolean {
    return (
      this.filteredTransactions &&
      this.filteredTransactions.length > this.LOAD_MORE_QUANTITY &&
      this.filterConfig[this.selectedFilter].limit < this.filteredTransactions.length
    );
  }

  public onChangeFilter(filter: TRANSACTIONS_FILTERS): void {
    this.selectedFilter = filter;
    if (this.invoiceTransactions?.length) {
      this.filterConfig[filter].filterInvoices();
    }
  }

  public getButtonClass(filter: TRANSACTIONS_FILTERS): string {
    let cssClass = 'btn invoice';
    if (filter === this.selectedFilter) {
      cssClass += ' invoice--selected';
    }
    return cssClass;
  }

  protected isShown(keyMessage: InvoiceRequestStatus): boolean {
    const conditions =
      (!Array.isArray(this.filteredTransactions) || !this.filteredTransactions.length) && !this.isErrorLoading && !this.loading;

    switch (keyMessage) {
      case InvoiceRequestStatus.EMPTY_HISTORY:
        return this.active && conditions;
      case InvoiceRequestStatus.NOT_OLD_INVOICES:
        return !this.active && conditions;
    }
  }
}
