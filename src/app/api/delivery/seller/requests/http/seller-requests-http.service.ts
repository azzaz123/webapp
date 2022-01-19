import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import { SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID } from './endpoints';

@Injectable()
export class SellerRequestsHttpService {
  constructor(private http: HttpClient) {}

  public getRequestInfo(requestId: string): Observable<SellerRequestDto> {
    return this.http.get<SellerRequestDto>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId));
  }
}
