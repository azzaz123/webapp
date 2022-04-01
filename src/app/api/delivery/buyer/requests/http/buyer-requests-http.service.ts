import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BUYER_REQUESTS_ENDPOINT,
  BUYER_REQUESTS_ITEMS_DETAILS,
  BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY,
} from '@api/delivery/buyer/requests/http/endpoints';
import { BuyerRequestsItemsDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-requests-items-details-dto.interface';
import { BuyerRequestsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-dto.interface';

import { Observable } from 'rxjs';
import { BuyerRequestBuyDto } from '../dtos/buyer-request-buy-dto.interface';
import { APP_VERSION } from '@environments/version';

@Injectable()
export class BuyerRequestsHttpService {
  constructor(private http: HttpClient) {}

  public get(itemHash: string): Observable<BuyerRequestsDto> {
    return this.http.get<BuyerRequestsDto>(BUYER_REQUESTS_ENDPOINT, { params: { [BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY]: itemHash } });
  }

  public getItemsDetails(itemHash: string): Observable<BuyerRequestsItemsDetailsDto> {
    return this.http.get<BuyerRequestsItemsDetailsDto>(BUYER_REQUESTS_ITEMS_DETAILS(itemHash));
  }

  public buy(buyerRequestBuy: BuyerRequestBuyDto): Observable<void> {
    return this.http.post<void>(BUYER_REQUESTS_ENDPOINT, buyerRequestBuy, this.getHeaders());
  }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'X-AppVersion': APP_VERSION.replace(/\./g, ''),
      }),
    };
  }
}
