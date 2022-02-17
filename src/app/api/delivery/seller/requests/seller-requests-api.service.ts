import { Injectable } from '@angular/core';
import { SELLER_REQUEST_CANCEL_STATUS } from '@api/core/model/delivery/seller-requests/seller-request-cancel-status.enum';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SellerRequestDto } from './dtos/seller-request-dto.interface';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';
import { mapSellerRequestDtoToSellerRequest } from './mappers/responses/seller-request.mapper';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsApiService {
  constructor(private sellerRequestsHttpService: SellerRequestsHttpService) {}

  public getRequestsByBuyerAndItem(buyerHash: string, itemHash: string): Observable<SellerRequest[]> {
    return this.sellerRequestsHttpService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(
      map((dtoResponse: SellerRequestDto[]) => {
        return dtoResponse.map((sellerRequest) => mapSellerRequestDtoToSellerRequest(sellerRequest));
      })
    );
  }

  public getRequestInfo(requestId: string): Observable<SellerRequest> {
    return this.sellerRequestsHttpService.getRequestInfo(requestId).pipe(
      map((dtoResponse: SellerRequestDto) => {
        return mapSellerRequestDtoToSellerRequest(dtoResponse);
      })
    );
  }

  public cancelRequest(requestId: string, status: SELLER_REQUEST_CANCEL_STATUS): Observable<void> {
    return this.sellerRequestsHttpService.cancelRequest(requestId, status);
  }

  public acceptRequestPostOfficeDropOff(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService.acceptRequestPostOfficeDropOff(requestId);
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService.acceptRequestHomePickup(requestId);
  }
}
