import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import { SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsHttpService {
  constructor(private http: HttpClient) {}

  public getRequestInfo(requestId: string): Observable<SellerRequestDto> {
    return this.http.get<SellerRequestDto>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId));
  }

  public cancelRequest(requestId: string): Observable<void> {
    return this.http.patch<void>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId), null);
  }
}
