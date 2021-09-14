import { Component, Input, OnInit } from '@angular/core';
import { InvoiceTransaction } from '@core/invoice/invoice.interface';
import { InvoiceService } from '@core/invoice/invoice.service';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
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

export const START_LIMIT = 5;

@Component({
  selector: 'tsl-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent implements OnInit {
  @Input() active: boolean;
  public loading = false;
  public invoiceTransactions: InvoiceTransaction[];
  public filteredTransactions: InvoiceTransaction[];
  public isErrorLoading = false;
  public filterInvoices = TRANSACTIONS_FILTERS;
  public selectedFilter = TRANSACTIONS_FILTERS.ALL;
  public invoiceRequestStatus = InvoiceRequestStatus;
  public filterConfig = {
    [this.filterInvoices.ALL]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions),
      limit: START_LIMIT,
    },
    [this.filterInvoices.INVOICES]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions.filter((invoice) => invoice.price >= 0)),
      limit: START_LIMIT,
    },
    [this.filterInvoices.CREDIT]: {
      filterInvoices: () => (this.filteredTransactions = this.invoiceTransactions.filter((invoice) => invoice.price < 0)),
      limit: START_LIMIT,
    },
  };
  public tabsBarElements: TabsBarElement<TRANSACTIONS_FILTERS>[] = [
    { value: TRANSACTIONS_FILTERS.ALL, label: $localize`:@@web_invoice_history_all:All` },
    { value: TRANSACTIONS_FILTERS.INVOICES, label: $localize`:@@web_invoice_history_invoices:Invoices` },
    { value: TRANSACTIONS_FILTERS.CREDIT, label: $localize`:@@web_invoice_history_credit:Credit memos` },
  ];

  private LOAD_MORE_QUANTITY = 5;
  private currencies = {
    EUR: '€',
    GBP: '£',
  };

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.getInvoiceTransactions();
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
}
