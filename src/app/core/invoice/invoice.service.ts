import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Invoice, InvoiceTransaction } from './invoice.interface';

export const PAYMENTS_API_URL = 'api/v3/payments';
export const INVOICE_HISTORY_ENDPOINT = `${PAYMENTS_API_URL}/c2b/stripe/subscriptions/transactions`;
export const INVOICE_DOWNLOAD_ENDPOINT = `${PAYMENTS_API_URL}/billing-info/invoice/document`;

@Injectable()
export class InvoiceService {
  public invoices: Invoice[];

  constructor(private http: HttpClient) {}

  public getInvoiceTransactions(
    cache: boolean = true
  ): Observable<InvoiceTransaction[]> {
    if (this.invoices && cache) {
      return of(this.invoices);
    }

    return this.http.get<InvoiceTransaction[]>(
      `${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`
    );
  }

  public generateInvoice(invoice: InvoiceTransaction): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`,
      {}
    );
  }

  public downloadInvoice(invoice: InvoiceTransaction): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`,
      { responseType: 'blob' }
    );
  }
}
