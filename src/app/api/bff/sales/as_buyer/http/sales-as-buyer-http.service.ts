import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesAsBuyerDto } from '../dtos/sales-as-buyer-dto.interface';
import { SALES_AS_BUYER_ENDPOINT } from './endpoint';

@Injectable()
export class SalesAsBuyerHttpService {
  constructor(private http: HttpClient) {}

  public get(params: HttpParams): Observable<SalesAsBuyerDto> {
    return this.http.get<SalesAsBuyerDto>(SALES_AS_BUYER_ENDPOINT, { params });
  }
}
