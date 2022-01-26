import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyerRequestsItemsDetailsHttpService } from './http/buyer-requests-items-details-http.service';
import { map, take } from 'rxjs/operators';

@Injectable()
export class BuyerRequestsItemsDetailsApiService {
  constructor(private buyerRequestsItemsDetailsHttpService: BuyerRequestsItemsDetailsHttpService) {}

  public getRequestItem(itemId: string): Observable<any> {
    return this.buyerRequestsItemsDetailsHttpService.getRequestItem(itemId).pipe(
      take(1),
      map((result) => '')
    );
  }
}
