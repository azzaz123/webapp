import { Injectable } from '@angular/core';

import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BuyerRequestsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-http.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { mapBuyerRequestsDtoToBuyerRequests } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests.mapper';
import { mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests-items-details.mapper';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class BuyerRequestsApiService {
  constructor(private buyerRequestsHttpService: BuyerRequestsHttpService) {}

  public getRequestsAsBuyerByItemHash(itemHash: string): Observable<BuyerRequest[]> {
    return this.buyerRequestsHttpService.get(itemHash).pipe(map(mapBuyerRequestsDtoToBuyerRequests));
  }

  public getRequestsItemsDetails(itemHash: string): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestsHttpService.getItemsDetails(itemHash).pipe(map(mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails));
  }
}
