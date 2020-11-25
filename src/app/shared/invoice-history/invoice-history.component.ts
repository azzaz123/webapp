import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { InvoiceTransactions } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent implements OnInit {
  @Input() active: boolean;
  @Input() isBillingInfo: boolean;
  public loading = false;
  public invoiceTransactions: InvoiceTransactions[];
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
      (invoiceTransactions) => {
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
        return <any>new Date(b.date) - <any>new Date(a.date);
      })
    );
  }

  protected isShowed(keyMessage: string): boolean {
    switch (keyMessage) {
      case 'EmptyHistory':
        return (
          (!this.invoiceTransactions ||
            (this.invoiceTransactions && !this.invoiceTransactions.length)) &&
          this.isBillingInfo &&
          !this.isErrorLoading
        );
      case 'NotOldInvoices':
        return (
          (!this.invoiceTransactions ||
            (this.invoiceTransactions && !this.invoiceTransactions.length)) &&
          !this.isBillingInfo &&
          !this.isErrorLoading
        );
    }
  }
}
