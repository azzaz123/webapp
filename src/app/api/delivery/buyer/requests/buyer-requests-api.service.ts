import { Injectable } from '@angular/core';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuyerRequestsHttpService } from './http/buyer-requests-http.service';
import { mapBuyerRequestsDtoToBuyerRequests } from './mappers/responses/buyer-requests.mapper';

@Injectable()
export class BuyerRequestsApiService {
  constructor(private buyerRequestsHttpService: BuyerRequestsHttpService) {}

  public getRequestsAsBuyerByItemHash(itemHash: string): Observable<BuyerRequest[]> {
    return this.buyerRequestsHttpService.get(itemHash).pipe(map(mapBuyerRequestsDtoToBuyerRequests));
  }
}
