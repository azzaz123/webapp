import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice, InvoiceTransaction } from './invoice.interface';
import { CategoryService } from '../category/category.service';
import { mergeMap } from 'rxjs/operators';

export const PAYMENTS_API_URL = 'api/v3/payments';
export const INVOICE_HISTORY_ENDPOINT = `${PAYMENTS_API_URL}/c2b/stripe/subscriptions/transactions`;
export const INVOICE_DOWNLOAD_ENDPOINT = `${PAYMENTS_API_URL}/billing-info/invoice/document`;

@Injectable()
export class InvoiceService {
  public invoices: Invoice[];

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  public getInvoiceTransactions(
    cache: boolean = true
  ): Observable<InvoiceTransaction[]> {
    if (this.invoices && cache) {
      return of(this.invoices);
    }

    return this.categoryService.getCategories().pipe(
      mergeMap(() => {
        return this.http.get<Invoice[]>(
          `${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`
        );
      })
    );
  }

  public generateInvoice(invoice: Invoice): Observable<Invoice[]> {
    return this.categoryService.getCategories().pipe(
      mergeMap(() => {
        return this.http.post<Invoice[]>(
          `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}`,
          invoice.id
        );
      })
    );
  }

  public downloadInvoice(invoice: Invoice): Observable<Invoice[]> {
    return this.categoryService.getCategories().pipe(
      mergeMap(() => {
        return this.http.get<Invoice[]>(
          `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`
        );
      })
    );
  }
}
