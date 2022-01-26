import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyerRequestsDto } from '../dtos/buyer-request-dto.interface';
import { BUYER_REQUESTS_ENDPOINT, BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY } from './endpoints';

@Injectable()
export class BuyerRequestsHttpService {
  constructor(private http: HttpClient) {}

  public get(itemHash: string): Observable<BuyerRequestsDto> {
    return this.http.get<BuyerRequestsDto>(BUYER_REQUESTS_ENDPOINT, { params: { [BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY]: itemHash } });
  }
}
