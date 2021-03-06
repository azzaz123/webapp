import { Injectable } from '@angular/core';

import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BuyerRequestsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-http.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { mapBuyerRequestsDtoToBuyerRequests } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests.mapper';
import { mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests-items-details.mapper';

import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties } from './mappers/responses/buyer-request-buy-mapper/buyer-request-buy.mapper';
import { BuyRequestErrorMapper } from './mappers/errors/buy-request/buy-request-error-mapper';
import { BuyRequestErrorResponse } from './dtos/errors';

@Injectable({ providedIn: 'root' })
export class BuyerRequestsApiService {
  private errorMapper: BuyRequestErrorMapper = new BuyRequestErrorMapper();
  constructor(private buyerRequestsHttpService: BuyerRequestsHttpService) {}

  public getRequestsAsBuyerByItemHash(itemHash: string): Observable<BuyerRequest[]> {
    return this.buyerRequestsHttpService.get(itemHash).pipe(map(mapBuyerRequestsDtoToBuyerRequests));
  }

  public getLastRequestAsBuyerByItemHash(itemHash: string): Observable<BuyerRequest | null> {
    return this.getRequestsAsBuyerByItemHash(itemHash).pipe(map((requests) => (requests.length === 0 ? null : requests[0])));
  }

  public getRequestsItemsDetails(itemHash: string): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestsHttpService.getItemsDetails(itemHash).pipe(map(mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails));
  }

  public buyRequest(state: PayviewState): Observable<void> {
    return this.buyerRequestsHttpService
      .buy(mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties(state))
      .pipe(catchError((error: BuyRequestErrorResponse) => this.errorMapper.map(error)));
  }

  public cancelRequest(buyerRequestId: string): Observable<void> {
    return this.buyerRequestsHttpService.cancel(buyerRequestId);
  }
}
