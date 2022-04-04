import { Injectable } from '@angular/core';

import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BuyerRequestsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-http.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { mapBuyerRequestsDtoToBuyerRequests } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests.mapper';
import { mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests-items-details.mapper';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties } from './mappers/responses/buyer-request-buy-mapper/buyer-request-buy.mapper';

@Injectable()
export class BuyerRequestsApiService {
  constructor(private buyerRequestsHttpService: BuyerRequestsHttpService, private uuidService: UuidService) {}

  public getRequestsAsBuyerByItemHash(itemHash: string): Observable<BuyerRequest[]> {
    return this.buyerRequestsHttpService.get(itemHash).pipe(map(mapBuyerRequestsDtoToBuyerRequests));
  }

  public getRequestsItemsDetails(itemHash: string): Observable<BuyerRequestsItemsDetails> {
    return this.buyerRequestsHttpService.getItemsDetails(itemHash).pipe(map(mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails));
  }

  public buyRequest(state: PayviewState): Observable<void> {
    const buyRequestId: string = this.uuidService.getUUID();
    return this.buyerRequestsHttpService.buy(mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties(state, buyRequestId));
  }
}
