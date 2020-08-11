import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice.interface';
import { MOCK_INVOICE_HISTORY } from '../../../tests/invoice.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { CategoryResponse } from '../category/category-response.interface';

export const INVOICE_HISTORY_ENDPOINT = 'api/v3/users/me/invoice-history';

@Injectable()
export class InvoiceService {

  public invoices: Invoice[];

  constructor(private http: HttpClient,
              private categoryService: CategoryService) {
  }

  public getInvoices(cache: boolean = true): Observable<Invoice[]> {
    if (this.invoices && cache) {
      return of(this.invoices);
    }

    return this.categoryService.getCategories()
    .pipe(
      mergeMap((categories) => {
        //return this.http.get<Invoice[]>(`${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`).pipe(
        return of(MOCK_INVOICE_HISTORY).pipe(
        catchError((error) => {
          return of(error);
        }))
        .pipe(
          map((invoices: Invoice[]) => {
            if (invoices.length > 0) {
              return invoices.map((invoice: Invoice) => this.mapInvoices(invoice, categories))
            }
          })
        );
      })
    )
  };

  private mapInvoices(invoice: Invoice, categories: CategoryResponse[]): Invoice {
    let category = categories.find((category: CategoryResponse) => invoice.category_id === category.category_id);
    
    if (!category && invoice.category_id === 0) {
      category = this.categoryService.getConsumerGoodsCategory();
    }
    
    if (category) {
      invoice.category_name = category.name;
      invoice.category_icon = category.icon_id;
    }

    return invoice;
  }
}