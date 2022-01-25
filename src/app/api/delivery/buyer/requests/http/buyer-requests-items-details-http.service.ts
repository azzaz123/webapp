import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BUYER_REQUESTS_ITEMS_DETAILS } from '@api/delivery/buyer/requests/http/endpoints';
import { BuyerRequestItemDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-item-details-dto.interface';

import { Observable } from 'rxjs';

@Injectable()
export class BuyerRequestsItemsDetailsHttpService {
  constructor(private http: HttpClient) {}

  public getRequestItem(itemHash: string): Observable<BuyerRequestItemDetailsDto> {
    return this.http.get<BuyerRequestItemDetailsDto>(BUYER_REQUESTS_ITEMS_DETAILS(itemHash));
  }
}
