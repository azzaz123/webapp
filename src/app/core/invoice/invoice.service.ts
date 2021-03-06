import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InvoiceTransaction } from './invoice.interface';

export const PAYMENTS_API_URL = 'api/v3/payments';
export const INVOICE_HISTORY_ENDPOINT = `${PAYMENTS_API_URL}/c2b/stripe/subscriptions/transactions`;
export const INVOICE_DOWNLOAD_ENDPOINT = `${PAYMENTS_API_URL}/billing-info/invoice/document`;

@Injectable()
export class InvoiceService {
  public invoiceTransactions: InvoiceTransaction[];

  constructor(private http: HttpClient) {}

  public getInvoiceTransactions(cache: boolean = true): Observable<InvoiceTransaction[]> {
    if (this.invoiceTransactions && cache) {
      return of(this.invoiceTransactions);
    }

    return this.http.get<InvoiceTransaction[]>(`${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`);
  }

  public generateInvoice(invoiceTransaction: InvoiceTransaction): Observable<string> {
    return this.http.post<string>(`${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoiceTransaction.id}`, {});
  }

  public downloadInvoice(invoice: InvoiceTransaction): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`, { responseType: 'blob' });
  }
}
